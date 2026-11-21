const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { isDbConnected } = require('../config/db');
const { generateToken } = require('../middleware/auth');

const memoryUsers = [];

const sanitizeUser = (user) => {
  const safeUser = { ...user };
  delete safeUser.password;
  return safeUser;
};

const getAllUsers = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(200).json(memoryUsers.map(sanitizeUser));
    }

    const users = await User.find({}).select('-password');
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const user = memoryUsers.find((item) => item._id === req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.status(200).json(sanitizeUser(user));
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: 'name, email, and password are required' });
    }

    if (!isDbConnected()) {
      const existingUser = memoryUsers.find((item) => item.email === email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hash = await bcrypt.hash(password, 10);
      const newUser = {
        _id: `user-${Date.now()}`,
        name,
        email,
        password: hash,
        role: 'user',
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
      };

      memoryUsers.push(newUser);
      return res
        .status(201)
        .json({
          message: 'User created successfully',
          user: sanitizeUser(newUser),
        });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });
    return res
      .status(201)
      .json({
        message: 'User created successfully',
        user: sanitizeUser(user.toObject()),
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const index = memoryUsers.findIndex((item) => item._id === req.params.id);
      if (index === -1)
        return res.status(404).json({ message: 'User not found' });

      memoryUsers[index] = {
        ...memoryUsers[index],
        ...req.body,
        updated: new Date().toISOString(),
      };

      return res
        .status(200)
        .json({
          message: 'User updated successfully',
          user: sanitizeUser(memoryUsers[index]),
        });
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (String(req.user.id) === req.params.id) {
      return res
        .status(400)
        .json({ message: 'You cannot delete the account currently signed in.' });
    }

    if (!isDbConnected()) {
      const index = memoryUsers.findIndex((item) => item._id === req.params.id);
      if (index === -1)
        return res.status(404).json({ message: 'User not found' });
      const [deletedUser] = memoryUsers.splice(index, 1);
      return res
        .status(200)
        .json({
          message: 'User deleted successfully',
          user: sanitizeUser(deletedUser),
        });
    }

    const user = await User.findByIdAndDelete(req.params.id).select(
      '-password',
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ message: 'User deleted successfully', user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteAllUsers = async (req, res) => {
  try {
    if (!isDbConnected()) {
      memoryUsers.length = 0;
      return res
        .status(200)
        .json({ message: 'All users deleted successfully' });
    }

    await User.deleteMany({});
    return res.status(200).json({ message: 'All users deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: 'name, email, and password are required' });
    }

    const userRecord = await createUserRecord({ name, email, password });
    const token = generateToken(userRecord);

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: sanitizeUser(userRecord),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'email and password are required' });
    }

    let userRecord;

    if (!isDbConnected()) {
      userRecord = memoryUsers.find((item) => item.email === email);
      if (
        !userRecord &&
        process.env.ADMIN_EMAIL &&
        process.env.ADMIN_PASSWORD &&
        email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase() &&
        password === process.env.ADMIN_PASSWORD
      ) {
        const hash = await bcrypt.hash(password, 10);
        userRecord = {
          _id: `admin-${Date.now()}`,
          name: process.env.ADMIN_NAME || 'Portfolio Admin',
          email: email.toLowerCase(),
          password: hash,
          role: 'admin',
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
        };
        memoryUsers.push(userRecord);
      }
      if (!userRecord)
        return res.status(401).json({ message: 'Invalid email or password' });

      const validPassword = await bcrypt.compare(password, userRecord.password);
      if (!validPassword)
        return res.status(401).json({ message: 'Invalid email or password' });
    } else {
      userRecord = await User.findOne({ email });
      if (!userRecord)
        return res.status(401).json({ message: 'Invalid email or password' });

      const validPassword = await userRecord.comparePassword(password);
      if (!validPassword)
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(userRecord);
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: sanitizeUser(
        userRecord.toObject ? userRecord.toObject() : userRecord,
      ),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const logoutUser = async (req, res) => {
  return res.status(200).json({ message: 'Logout successful' });
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!isDbConnected()) {
      const user = memoryUsers.find((item) => item._id === userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.status(200).json(sanitizeUser(user));
    }

    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createUserRecord = async ({ name, email, password }) => {
  if (!isDbConnected()) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRecord = {
      _id: `user-${Date.now()}`,
      name,
      email,
      password: hashedPassword,
      role: 'user',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    };

    memoryUsers.push(userRecord);
    return userRecord;
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const createdUser = await User.create({ name, email, password });
  return createdUser.toObject();
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  deleteAllUsers,
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
};
