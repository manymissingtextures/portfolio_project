import express from 'express';
import {
  createProject,
  deleteAllProjects,
  deleteProject,
  getAllProjects,
  getProjectById,
  updateProject,
} from '../controllers/projectController.js';

const router = express.Router();

router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.delete('/', deleteAllProjects);

export default router;
