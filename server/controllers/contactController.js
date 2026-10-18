import Contact from '../models/contact.model.js';

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ created: -1 });
    return res.json(contacts);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch contacts.', error: error.message });
  }
};

export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    return res.json(contact);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch contact.', error: error.message });
  }
};

export const createContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    return res.status(201).json(contact);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to create contact.', error: error.message });
  }
};

export const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    return res.json(contact);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to update contact.', error: error.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    return res.json({ message: 'Contact deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete contact.', error: error.message });
  }
};

export const deleteAllContacts = async (req, res) => {
  try {
    const result = await Contact.deleteMany({});
    return res.json({ message: 'All contacts deleted.', count: result.deletedCount });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete contacts.', error: error.message });
  }
};
