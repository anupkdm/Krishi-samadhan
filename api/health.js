const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://anupkadam:anup96k@cluster0.megoa4x.mongodb.net/krishi_samadhan?retryWrites=true&w=majority';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
    }
    const count = await mongoose.connection.db.collection('users').countDocuments();
    res.json({
      status: 'healthy',
      database: 'MongoDB Atlas Connected',
      totalUsers: count,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.json({
      status: 'degraded',
      database: 'Error connecting to Atlas',
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
};
