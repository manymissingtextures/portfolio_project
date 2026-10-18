import express from 'express';
import {
  deleteAllUsers,
  deleteUser,
  getAllUsers,
  getUserById,
  getUserProfile,
  loginUser,
  registerUser,
  updateUser,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/signin', loginUser);
router.get('/profile', protect, getUserProfile);
router.get('/', protect, getAllUsers);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);
router.delete('/', protect, deleteAllUsers);

export default router;
