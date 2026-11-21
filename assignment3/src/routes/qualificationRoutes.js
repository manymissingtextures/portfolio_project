const express = require('express');
const {
  getAllQualifications,
  getQualificationById,
  createQualification,
  updateQualification,
  deleteQualification,
  deleteAllQualifications,
} = require('../controllers/qualificationController');
const { protect, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllQualifications);
router.get('/:id', getQualificationById);
router.post('/', protect, requireAdmin, createQualification);
router.put('/:id', protect, requireAdmin, updateQualification);
router.delete('/:id', protect, requireAdmin, deleteQualification);
router.delete('/', protect, requireAdmin, deleteAllQualifications);

module.exports = router;
