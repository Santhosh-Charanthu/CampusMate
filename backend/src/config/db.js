// backend/src/config/db.js
const mongoose = require('mongoose');
const DEFAULT_URI = 'mongodb://127.0.0.1:27017/campusmate';

// For in-memory MongoDB used during local dev when USE_INMEM_DB=true
let mongoMemoryServer = null;

async function connectDB() {
  // If explicitly requested, start an in-memory MongoDB instance
  if (String(process.env.USE_INMEM_DB).toLowerCase() === 'true') {
    try {
      console.log('🧪 Starting in-memory MongoDB for development...');
      // require lazily so production servers without the package don't load it
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const uri = mongoMemoryServer.getUri();
      await mongoose.connect(uri, {});
      if (typeof mongoose.set === 'function') mongoose.set('strictQuery', true);
      console.log('✅ In-memory MongoDB started and connected');
      mongoose.connection.on('connected', () => console.log('Mongoose connected (in-memory)'));
      mongoose.connection.on('error', (e) => console.error('Mongoose connection error', e));
      mongoose.connection.on('disconnected', () => console.warn('Mongoose disconnected'));
      return;
    } catch (err) {
      console.error('❌ Failed to start in-memory MongoDB:', err);
      throw err;
    }
  }

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

  if (mongoMemoryServer) {
    try {
      await mongoMemoryServer.stop();
      console.log('In-memory MongoDB stopped.');
    } catch (e) {
      console.error('Error stopping in-memory MongoDB', e);
    }
    mongoMemoryServer = null;
  }
}

module.exports = { connectDB, closeDB };
