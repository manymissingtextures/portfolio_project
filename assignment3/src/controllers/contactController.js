const Contact = require('../models/Contact');
const { isDbConnected } = require('../config/db');

const memoryContacts = [];
const contactStatuses = ['Unread', 'In progress', 'Solved', 'Unresolved'];

const getAllContacts = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(200).json(memoryContacts);
    }

    const contacts = await Contact.find();
    return res.status(200).json(contacts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMyContacts = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const contacts = memoryContacts.filter(
        (contact) => contact.user === req.user.id,
      );
      return res.status(200).json(contacts);
    }

    const contacts = await Contact.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    return res.status(200).json(contacts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getContactById = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const contact = memoryContacts.find((item) => item._id === req.params.id);
      if (!contact)
        return res.status(404).json({ message: 'Contact not found' });
      return res.status(200).json(contact);
    }

    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    return res.status(200).json(contact);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createContact = async (req, res) => {
  try {
    const { firstname, lastname, email, subject, content } = req.body;

    if (!firstname || !lastname || !email || !subject || !content) {
      return res
        .status(400)
        .json({
          message:
            'firstname, lastname, email, subject, and content are required',
        });
    }

    if (!isDbConnected()) {
      const newContact = {
        _id: `contact-${Date.now()}`,
        firstname,
        lastname,
        email,
        subject,
        content,
        status: 'Unread',
        user: req.user ? req.user.id : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      memoryContacts.push(newContact);
      return res.status(201).json(newContact);
    }

    const contact = await Contact.create({
      firstname,
      lastname,
      email,
      subject,
      content,
      user: req.user ? req.user.id : undefined,
    });
    return res.status(201).json(contact);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateContact = async (req, res) => {
  try {
    const { status } = req.body;

    if (!contactStatuses.includes(status)) {
      return res.status(400).json({ message: 'A valid contact status is required' });
    }

    if (!isDbConnected()) {
      const index = memoryContacts.findIndex(
        (item) => item._id === req.params.id,
      );
      if (index === -1)
        return res.status(404).json({ message: 'Contact not found' });

      memoryContacts[index] = {
        ...memoryContacts[index],
        status,
        updatedAt: new Date().toISOString(),
      };

      return res.status(200).json(memoryContacts[index]);
    }

    const contact = await Contact.findByIdAndUpdate(req.params.id, { status }, {
      new: true,
      runValidators: true,
    });

    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    return res.status(200).json(contact);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteContact = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const index = memoryContacts.findIndex(
        (item) => item._id === req.params.id,
      );
      if (index === -1)
        return res.status(404).json({ message: 'Contact not found' });
      const [deletedContact] = memoryContacts.splice(index, 1);
      return res
        .status(200)
        .json({
          message: 'Contact deleted successfully',
          contact: deletedContact,
        });
    }

    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    return res
      .status(200)
      .json({ message: 'Contact deleted successfully', contact });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteAllContacts = async (req, res) => {
  try {
    if (!isDbConnected()) {
      memoryContacts.length = 0;
      return res
        .status(200)
        .json({ message: 'All contacts deleted successfully' });
    }

    await Contact.deleteMany({});
    return res
      .status(200)
      .json({ message: 'All contacts deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllContacts,
  getMyContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  deleteAllContacts,
};
