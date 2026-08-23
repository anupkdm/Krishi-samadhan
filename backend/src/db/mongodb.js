require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

let isConnected = false;

async function connectMongo() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI || 'mongodb+srv://anupkadam:anup96k@cluster0.megoa4x.mongodb.net/krishi_samadhan?retryWrites=true&w=majority';

  try {
    console.log('🍃 Connecting to MongoDB Atlas cluster...');
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      autoIndex: true
    });

    isConnected = true;
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}/${conn.connection.name}`);

    // Seed default users in Mongo if they don't exist
    await seedDefaultUsersMongo();

    return conn;
  } catch (err) {
    console.error('❌ MongoDB Atlas connection error:', err.message);
    return null;
  }
}

async function seedDefaultUsersMongo() {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding default user accounts to MongoDB Atlas...');
      const farmerHash = await bcrypt.hash('farmer123', 10);
      const adminHash = await bcrypt.hash('admin123', 10);

      await User.create([
        {
          name: 'Ramesh Patil',
          email: 'farmer@krishisamadhan.in',
          password_hash: farmerHash,
          role: 'farmer',
          location: 'Sangamner, Maharashtra',
          profile: {
            farm_name: "Ramesh Patil's Farm",
            crop: 'Onion & Pomegranate',
            location: 'Sangamner, Maharashtra',
            farm_area: 5.5,
            soil_type: 'Deep Vertisol (Black Cotton Soil)'
          }
        },
        {
          name: 'Krishi Extension Officer',
          email: 'admin@krishisamadhan.in',
          password_hash: adminHash,
          role: 'authority',
          location: 'Nashik, Maharashtra',
          profile: {
            farm_name: 'District Krishi Vigyan Kendra',
            crop: 'All Horticultural & Field Crops',
            location: 'Nashik, Maharashtra',
            farm_area: 25.0,
            soil_type: 'Alluvial & Medium Black Soil'
          }
        }
      ]);
      console.log('✅ Default users seeded to MongoDB Atlas (farmer@krishisamadhan.in / admin@krishisamadhan.in)');
    }
  } catch (err) {
    console.warn('MongoDB seeding notice:', err.message);
  }
}

module.exports = { connectMongo, isConnected: () => isConnected && mongoose.connection.readyState === 1 };
