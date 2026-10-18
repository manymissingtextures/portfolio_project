import mongoose from 'mongoose';

export const connectDb = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is required. Configure it in your local .env file.');
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, {
    dbName: 'Portfolio',
    serverSelectionTimeoutMS: 10000,
  });

  console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
};

export default connectDb;
