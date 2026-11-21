const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio';

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log(`MongoDB connected successfully: ${uri}`);
    await removeUniqueContactEmailIndex();
    await seedAdminUser();
  } catch (error) {
    isConnected = false;
    console.warn(
      'MongoDB is unavailable. Starting in fallback mode:',
      error.message,
    );
  }
};

const removeUniqueContactEmailIndex = async () => {
  const Contact = require('../models/Contact');
  const indexes = await Contact.collection.indexes();
  const emailIndex = indexes.find(
    (index) => index.key.email === 1 && index.unique,
  );

  if (emailIndex) {
    await Contact.collection.dropIndex(emailIndex.name);
  }
};

const seedAdminUser = async () => {
  try {
    const User = require('../models/User');
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME || 'Portfolio Admin';

    if (!email || !password) {
      console.warn('Skipping admin seeding; set ADMIN_EMAIL and ADMIN_PASSWORD.');
      return;
    }

    const existingAdmin = await User.findOne({ email: email.toLowerCase() });
    if (!existingAdmin) {
      await User.create({ name, email, password, role: 'admin' });
      console.log(`Admin account created: ${email}`);
    } else if (existingAdmin.role !== 'admin') {
      existingAdmin.role = 'admin';
      await existingAdmin.save();
    }
  } catch (error) {
    console.warn('Could not seed the admin account:', error.message);
  }
};

const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

module.exports = {
  connectDB,
  isDbConnected,
  mongoose,
};
