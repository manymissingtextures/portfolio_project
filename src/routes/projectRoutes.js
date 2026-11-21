const express = require('express');
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  deleteAllProjects,
} = require('../controllers/projectController');
const { protect, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.post('/', protect, requireAdmin, createProject);
router.put('/:id', protect, requireAdmin, updateProject);
router.delete('/:id', protect, requireAdmin, deleteProject);
router.delete('/', protect, requireAdmin, deleteAllProjects);

module.exports = router;
