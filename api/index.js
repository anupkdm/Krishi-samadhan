const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://anupkadam:anup96k@cluster0.megoa4x.mongodb.net/krishi_samadhan?retryWrites=true&w=majority';
const JWT_SECRET = process.env.JWT_SECRET || 'krishi-samadhan-jwt-secret-key-2026';

// Enable CORS for Vercel and all origins
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Mongoose Connection Caching for Serverless Invocations
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log('🍃 MongoDB Atlas Connected (Serverless)');
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

// User Schema & Model
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
}, {
  timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

// Middleware to ensure DB connection before handling requests
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
  } catch (err) {
    console.error('Database connection failure:', err.message);
  }
  next();
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({
      status: 'healthy',
      database: 'MongoDB Atlas Connected',
      totalUsers: count,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.json({
      status: 'degraded',
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// 1. REGISTER
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, location } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Please enter your full name.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const userRole = role || 'farmer';
    const userLocation = location || 'Maharashtra, India';

    await connectToDatabase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email address already exists. Please login instead.' });
    }

    const password_hash = await bcrypt.hash(password, 10);

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

    res.status(201).json({
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
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message || 'Internal server error during registration.' });
  }
});

// 2. LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide both email and password.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    await connectToDatabase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      // Demo farmer account fallback
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

    res.json({
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
    console.error('Login error:', err);
    res.status(500).json({ error: err.message || 'Internal server error during login.' });
  }
});

// 3. GET CURRENT USER
app.get('/api/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    await connectToDatabase();
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
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
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired session token' });
  }
});

module.exports = app;
