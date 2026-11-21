const express = require('express');
const {
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
} = require('../controllers/userController');
const { protect, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', protect, getProfile);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', protect, logoutUser);
router.get('/', protect, requireAdmin, getAllUsers);
router.get('/:id', protect, requireAdmin, getUserById);
router.post('/', protect, requireAdmin, createUser);
router.put('/:id', protect, requireAdmin, updateUser);
router.delete('/:id', protect, requireAdmin, deleteUser);
router.delete('/', protect, requireAdmin, deleteAllUsers);

module.exports = router;
