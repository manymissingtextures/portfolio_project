import express from 'express';
import {
  createQualification,
  deleteAllQualifications,
  deleteQualification,
  getAllQualifications,
  getQualificationById,
  updateQualification,
} from '../controllers/qualificationController.js';

const router = express.Router();

router.get('/', getAllQualifications);
router.get('/:id', getQualificationById);
router.post('/', createQualification);
router.put('/:id', updateQualification);
router.delete('/:id', deleteQualification);
router.delete('/', deleteAllQualifications);

export default router;
