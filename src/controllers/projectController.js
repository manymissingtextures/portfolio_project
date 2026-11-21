const Project = require('../models/Project');
const { isDbConnected } = require('../config/db');

const memoryProjects = [];
const isValidGithubUrl = (value) =>
  !value ||
  /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/.test(value);

const getAllProjects = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(200).json(memoryProjects);
    }

    const projects = await Project.find();
    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const project = memoryProjects.find((item) => item._id === req.params.id);
      if (!project)
        return res.status(404).json({ message: 'Project not found' });
      return res.status(200).json(project);
    }

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    const {
      title,
      firstname,
      lastname,
      email,
      githubUrl,
      completion,
      description,
    } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ message: 'title is required' });
    }
    if (!isValidGithubUrl(githubUrl)) {
      return res.status(400).json({ message: 'Enter a valid GitHub repository URL.' });
    }

    if (!isDbConnected()) {
      const newProject = {
        _id: `project-${Date.now()}`,
        title,
        firstname,
        lastname,
        email,
        githubUrl: githubUrl || '',
        completion: completion || null,
        description: description || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      memoryProjects.push(newProject);
      return res.status(201).json(newProject);
    }

    const project = await Project.create({
      title,
      firstname,
      lastname,
      email,
      githubUrl,
      completion,
      description,
    });
    return res.status(201).json(project);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    if (
      Object.prototype.hasOwnProperty.call(req.body, 'githubUrl') &&
      !isValidGithubUrl(req.body.githubUrl)
    ) {
      return res.status(400).json({ message: 'Enter a valid GitHub repository URL.' });
    }

    if (!isDbConnected()) {
      const index = memoryProjects.findIndex(
        (item) => item._id === req.params.id,
      );
      if (index === -1)
        return res.status(404).json({ message: 'Project not found' });

      memoryProjects[index] = {
        ...memoryProjects[index],
        ...req.body,
        updatedAt: new Date().toISOString(),
      };

      return res.status(200).json(memoryProjects[index]);
    }

    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!project) return res.status(404).json({ message: 'Project not found' });
    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const index = memoryProjects.findIndex(
        (item) => item._id === req.params.id,
      );
      if (index === -1)
        return res.status(404).json({ message: 'Project not found' });
      const [deletedProject] = memoryProjects.splice(index, 1);
      return res
        .status(200)
        .json({
          message: 'Project deleted successfully',
          project: deletedProject,
        });
    }

    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    return res
      .status(200)
      .json({ message: 'Project deleted successfully', project });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteAllProjects = async (req, res) => {
  try {
    if (!isDbConnected()) {
      memoryProjects.length = 0;
      return res
        .status(200)
        .json({ message: 'All projects deleted successfully' });
    }

    await Project.deleteMany({});
    return res
      .status(200)
      .json({ message: 'All projects deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  deleteAllProjects,
};
