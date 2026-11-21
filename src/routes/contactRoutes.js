const express = require('express');
const {
  getAllContacts,
  getMyContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  deleteAllContacts,
} = require('../controllers/contactController');
const { protect, optionalProtect, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/mine', protect, getMyContacts);
router.get('/', protect, requireAdmin, getAllContacts);
router.get('/:id', protect, requireAdmin, getContactById);
router.post('/', optionalProtect, createContact);
router.put('/:id', protect, requireAdmin, updateContact);
router.delete('/:id', protect, requireAdmin, deleteContact);
router.delete('/', protect, requireAdmin, deleteAllContacts);

module.exports = router;
