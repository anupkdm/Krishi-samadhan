const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://anupkadam:anup96k@cluster0.megoa4x.mongodb.net/krishi_samadhan?retryWrites=true&w=majority';
const JWT_SECRET = process.env.JWT_SECRET || 'krishi-samadhan-jwt-secret-key-2026';

let cached = global.mongoose || { conn: null, promise: null };
global.mongoose = cached;

async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000
    }).then((m) => {
      console.log('🍃 MongoDB Atlas Connected (Vercel Serverless login.js)');
      return m;
    });
  }
  cached.conn = await cached.promise;
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
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide both email and password.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    await connectToDatabase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      // Demo farmer auto-provision
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
        return res.json({ status: 'success', token, user: { id: demoUser._id.toString(), name: demoUser.name, email: demoUser.email, role: demoUser.role, location: demoUser.location } });
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

    return res.json({
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
  } catch (err) {
    console.error('Login serverless error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
};
