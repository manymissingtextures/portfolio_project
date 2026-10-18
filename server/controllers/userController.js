import User from '../models/user.model.js';
import { signToken } from '../middleware/auth.js';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      created: new Date(),
      updated: new Date(),
    });

    const token = signToken(user);
    const safeUser = user.toObject();
    delete safeUser.password;

    return res.status(201).json({ token, user: safeUser });
  } catch (error) {
    return res.status(400).json({ message: 'Failed to register user.', error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = signToken(user);
    const safeUser = user.toObject();
    delete safeUser.password;

    return res.json({ token, user: safeUser });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to sign in.', error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ created: -1 });
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch users.', error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json(user);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to fetch user.', error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch profile.', error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const { name, email, password } = req.body;
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email.trim().toLowerCase();
    if (password !== undefined) user.password = password;
    user.updated = new Date();

    await user.save();
    return res.json(user);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to update user.', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete user.', error: error.message });
  }
};

export const deleteAllUsers = async (req, res) => {
  try {
    const result = await User.deleteMany({});
    return res.json({ message: 'All users deleted.', count: result.deletedCount });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete users.', error: error.message });
  }
};
