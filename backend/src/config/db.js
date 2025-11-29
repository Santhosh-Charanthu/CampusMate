// backend/src/config/db.js
const mongoose = require('mongoose');

const DEFAULT_URI = 'mongodb://127.0.0.1:27017/campusmate';

async function connectDB() {
  const uri = (process.env.MONGO_URI || DEFAULT_URI).trim();

  // Only keep supported options. Avoid legacy driver options like
  // useNewUrlParser, useUnifiedTopology, useCreateIndex, useFindAndModify, etc.
  const opts = {
    // Optional sane defaults:
    // maxPoolSize: 10,
    // serverSelectionTimeoutMS: 5000,
    // connectTimeoutMS: 10000,
    // family: 4,
  };

  try {
    await mongoose.connect(uri, opts);
    // optional: keep strictQuery to avoid Mongoose deprecation warnings in some versions
    if (typeof mongoose.set === 'function') mongoose.set('strictQuery', true);
    console.log('✅ MongoDB connected');
    // connection listeners
    mongoose.connection.on('connected', () => console.log('Mongoose connected'));
    mongoose.connection.on('error', (e) => console.error('Mongoose connection error', e));
    mongoose.connection.on('disconnected', () => console.warn('Mongoose disconnected'));
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message || err);
    // rethrow so caller (app startup) can handle/exit
    throw err;
  }
}

async function closeDB() {
  try {
    await mongoose.connection.close(false);
    console.log('Mongoose connection closed.');
  } catch (e) {
    console.error('Error while closing mongoose connection', e);
  }
}

module.exports = { connectDB, closeDB };
