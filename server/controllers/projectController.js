import Project from '../models/project.model.js';

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ created: -1 });
    return res.json(projects);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch projects.', error: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    return res.json(project);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch project.', error: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    return res.status(201).json(project);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to create project.', error: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    return res.json(project);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to update project.', error: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    return res.json({ message: 'Project deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete project.', error: error.message });
  }
};

export const deleteAllProjects = async (req, res) => {
  try {
    const result = await Project.deleteMany({});
    return res.json({ message: 'All projects deleted.', count: result.deletedCount });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete projects.', error: error.message });
  }
};
