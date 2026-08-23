const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://anupkadam:anup96k@cluster0.megoa4x.mongodb.net/krishi_samadhan?retryWrites=true&w=majority';
const JWT_SECRET = process.env.JWT_SECRET || 'krishi-samadhan-jwt-secret-key-2026';

let cached = global.mongoose || { conn: null, promise: null };
global.mongoose = cached;

async function connectToDatabase() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000
    }).then((m) => {
      console.log('🍃 MongoDB Atlas Connected (Vercel Serverless frontend/api)');
      return m;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ['farmer', 'authority', 'user'], default: 'farmer' },
  location: { type: String, default: 'Maharashtra, India' },
  profile: {
    farm_name: { type: String, default: '' },
    crop: { type: String, default: 'Onion & Wheat' },
    location: { type: String, default: 'Maharashtra, India' },
    farm_area: { type: Number, default: 5.0 },
    soil_type: { type: String, default: 'Vertisol (Black Cotton Soil)' }
  },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = async function handler(req, res) {
  // Global CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = (req.url || '').toLowerCase();
  const method = (req.method || 'GET').toUpperCase();

  try {
    await connectToDatabase();

    // 1. HEALTH CHECK
    if (url.includes('health') || url === '/' || url === '/api') {
      const count = await User.countDocuments();
      return res.status(200).json({
        status: 'healthy',
        database: 'MongoDB Atlas Connected',
        totalUsers: count,
        timestamp: new Date().toISOString()
      });
    }

    // 2. REGISTER
    if (url.includes('register')) {
      if (method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) {}
      }
      body = body || {};

      const { name, email, password, role, location } = body;

      if (!name || !name.trim()) return res.status(400).json({ error: 'Please enter your full name.' });
      if (!email || !email.trim()) return res.status(400).json({ error: 'Please enter a valid email address.' });
      if (!password || password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters long.' });

      const normalizedEmail = email.trim().toLowerCase();
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({ error: 'An account with this email address already exists. Please login instead.' });
      }

      const password_hash = await bcrypt.hash(password, 10);
      const userRole = role || 'farmer';
      const userLocation = location || 'Maharashtra, India';

      const newUser = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password_hash,
        role: userRole,
        location: userLocation,
        profile: {
          farm_name: `${name.trim()}'s Farm`,
          crop: 'Onion & Wheat',
          location: userLocation,
          farm_area: 5.0,
          soil_type: 'Vertisol (Black Cotton Soil)'
        }
      });

      const token = jwt.sign(
        { id: newUser._id.toString(), email: normalizedEmail, role: userRole, name: newUser.name },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      console.log('🍃 Registered new user in Atlas:', normalizedEmail);

      return res.status(201).json({
        status: 'success',
        message: 'Account registered successfully in MongoDB Atlas!',
        token,
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          location: newUser.location,
          profile: newUser.profile
        }
      });
    }

    // 3. LOGIN
    if (url.includes('login')) {
      if (method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) {}
      }
      body = body || {};

      const { email, password } = body;
      if (!email || !password) return res.status(400).json({ error: 'Please provide both email and password.' });

      const normalizedEmail = email.trim().toLowerCase();
      const user = await User.findOne({ email: normalizedEmail });

      if (!user) {
        if (normalizedEmail === 'farmer@krishisamadhan.in' && password === 'farmer123') {
          const hash = await bcrypt.hash('farmer123', 10);
          const demoUser = await User.create({
            name: 'Ramesh Patil',
            email: 'farmer@krishisamadhan.in',
            password_hash: hash,
            role: 'farmer',
            location: 'Sangamner, Maharashtra'
          });
          const token = jwt.sign({ id: demoUser._id.toString(), email: demoUser.email, role: demoUser.role, name: demoUser.name }, JWT_SECRET, { expiresIn: '30d' });
          return res.status(200).json({ status: 'success', token, user: { id: demoUser._id.toString(), name: demoUser.name, email: demoUser.email, role: demoUser.role, location: demoUser.location } });
        }
        return res.status(401).json({ error: 'Invalid email or password. Please check your credentials.' });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password. Please check your credentials.' });
      }

      const token = jwt.sign(
        { id: user._id.toString(), email: user.email, role: user.role, name: user.name },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      return res.status(200).json({
        status: 'success',
        message: 'Logged in successfully!',
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          location: user.location,
          profile: user.profile
        }
      });
    }

    // 4. ME
    if (url.includes('me')) {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ error: 'User not found' });

      return res.status(200).json({
        status: 'success',
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          location: user.location,
          profile: user.profile
        }
      });
    }

    return res.status(404).json({ error: `API endpoint not found for URL: ${url}` });
  } catch (err) {
    console.error('Serverless error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
};
