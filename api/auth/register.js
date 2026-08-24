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
      console.log('🍃 MongoDB Atlas Connected (Vercel Serverless register.js)');
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
    const { name, email, password, role, location } = req.body || {};

    if (!name || !name.trim()) return res.status(400).json({ error: 'Please enter your full name.' });
    if (!email || !email.trim()) return res.status(400).json({ error: 'Please enter a valid email address.' });
    if (!password || password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters long.' });

    const normalizedEmail = email.trim().toLowerCase();
    await connectToDatabase();

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
  } catch (err) {
    console.error('Registration serverless error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
};
