const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  password_hash: {
    type: String,
    required: [true, 'Password hash is required']
  },
  role: {
    type: String,
    enum: ['farmer', 'authority', 'user'],
    default: 'farmer'
  },
  location: {
    type: String,
    default: 'Maharashtra, India'
  },
  profile: {
    farm_name: { type: String, default: '' },
    crop: { type: String, default: 'Onion & Wheat' },
    location: { type: String, default: 'Maharashtra, India' },
    farm_area: { type: Number, default: 5.0 },
    soil_type: { type: String, default: 'Vertisol (Black Cotton Soil)' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id ? ret._id.toString() : ret.id;
      delete ret.password_hash;
      delete ret.__v;
      return ret;
    }
  }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
