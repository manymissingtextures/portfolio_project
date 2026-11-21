const Qualification = require('../models/Qualification');
const { isDbConnected } = require('../config/db');

const memoryQualifications = [];

const getAllQualifications = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(200).json(memoryQualifications);
    }

    const qualifications = await Qualification.find();
    return res.status(200).json(qualifications);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getQualificationById = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const qualification = memoryQualifications.find(
        (item) => item._id === req.params.id,
      );
      if (!qualification)
        return res.status(404).json({ message: 'Qualification not found' });
      return res.status(200).json(qualification);
    }

    const qualification = await Qualification.findById(req.params.id);
    if (!qualification)
      return res.status(404).json({ message: 'Qualification not found' });
    return res.status(200).json(qualification);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createQualification = async (req, res) => {
  try {
    const { title, organization, completion, description } = req.body;

    if (!title || !organization) {
      return res
        .status(400)
        .json({ message: 'title and organization are required' });
    }

    if (!isDbConnected()) {
      const newQualification = {
        _id: `qualification-${Date.now()}`,
        title,
        organization,
        completion: completion || null,
        description: description || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      memoryQualifications.push(newQualification);
      return res.status(201).json(newQualification);
    }

    const qualification = await Qualification.create({
      title,
      organization,
      completion,
      description,
    });
    return res.status(201).json(qualification);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateQualification = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const index = memoryQualifications.findIndex(
        (item) => item._id === req.params.id,
      );
      if (index === -1)
        return res.status(404).json({ message: 'Qualification not found' });

      memoryQualifications[index] = {
        ...memoryQualifications[index],
        ...req.body,
        updatedAt: new Date().toISOString(),
      };

      return res.status(200).json(memoryQualifications[index]);
    }

    const qualification = await Qualification.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!qualification)
      return res.status(404).json({ message: 'Qualification not found' });
    return res.status(200).json(qualification);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteQualification = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const index = memoryQualifications.findIndex(
        (item) => item._id === req.params.id,
      );
      if (index === -1)
        return res.status(404).json({ message: 'Qualification not found' });
      const [deletedQualification] = memoryQualifications.splice(index, 1);
      return res
        .status(200)
        .json({
          message: 'Qualification deleted successfully',
          qualification: deletedQualification,
        });
    }

    const qualification = await Qualification.findByIdAndDelete(req.params.id);
    if (!qualification)
      return res.status(404).json({ message: 'Qualification not found' });
    return res
      .status(200)
      .json({ message: 'Qualification deleted successfully', qualification });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteAllQualifications = async (req, res) => {
  try {
    if (!isDbConnected()) {
      memoryQualifications.length = 0;
      return res
        .status(200)
        .json({ message: 'All qualifications deleted successfully' });
    }

    await Qualification.deleteMany({});
    return res
      .status(200)
      .json({ message: 'All qualifications deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllQualifications,
  getQualificationById,
  createQualification,
  updateQualification,
  deleteQualification,
  deleteAllQualifications,
};
