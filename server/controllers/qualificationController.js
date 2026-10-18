import Qualification from '../models/qualification.model.js';

export const getAllQualifications = async (req, res) => {
  try {
    const qualifications = await Qualification.find().sort({ created: -1 });
    return res.json(qualifications);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch qualifications.', error: error.message });
  }
};

export const getQualificationById = async (req, res) => {
  try {
    const qualification = await Qualification.findById(req.params.id);

    if (!qualification) {
      return res.status(404).json({ message: 'Qualification not found.' });
    }

    return res.json(qualification);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch qualification.', error: error.message });
  }
};

export const createQualification = async (req, res) => {
  try {
    const qualification = await Qualification.create(req.body);
    return res.status(201).json(qualification);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to create qualification.', error: error.message });
  }
};

export const updateQualification = async (req, res) => {
  try {
    const qualification = await Qualification.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!qualification) {
      return res.status(404).json({ message: 'Qualification not found.' });
    }

    return res.json(qualification);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to update qualification.', error: error.message });
  }
};

export const deleteQualification = async (req, res) => {
  try {
    const qualification = await Qualification.findByIdAndDelete(req.params.id);

    if (!qualification) {
      return res.status(404).json({ message: 'Qualification not found.' });
    }

    return res.json({ message: 'Qualification deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete qualification.', error: error.message });
  }
};

export const deleteAllQualifications = async (req, res) => {
  try {
    const result = await Qualification.deleteMany({});
    return res.json({ message: 'All qualifications deleted.', count: result.deletedCount });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete qualifications.', error: error.message });
  }
};
