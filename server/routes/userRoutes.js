import express from 'express';
import {
  deleteAllUsers,
  deleteUser,
  getAllUsers,
  getUserProfile,
  loginUser,
  registerUser,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/signin', loginUser);
router.get('/profile', protect, getUserProfile);
router.get('/', protect, getAllUsers);
router.delete('/:id', protect, deleteUser);
router.delete('/', protect, deleteAllUsers);

export default router;
