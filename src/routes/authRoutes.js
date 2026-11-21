const express = require('express');
const { loginUser, logoutUser } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/signin', loginUser);
router.get('/signout', protect, logoutUser);

module.exports = router;
