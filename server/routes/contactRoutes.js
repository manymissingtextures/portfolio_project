import express from 'express';
import {
  createContact,
  deleteAllContacts,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../controllers/contactController.js';

const router = express.Router();

router.get('/', getAllContacts);
router.get('/:id', getContactById);
router.post('/', createContact);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);
router.delete('/', deleteAllContacts);

export default router;
