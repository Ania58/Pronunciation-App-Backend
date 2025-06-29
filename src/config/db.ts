import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || '';

export const connectToDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};
