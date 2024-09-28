// controllers/contactController.js
const pool = require('../db');
const { validationResult } = require('express-validator');

const createContact = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { name, email, phone, address } = req.body;
  const userId = req.user.id;

  try {
    const [result] = await pool.query(
      'INSERT INTO contacts (user_id, name, email, phone, address) VALUES (?, ?, ?, ?, ?)',
      [userId, name, email, phone, address]
    );

    res.status(201).json({ message: 'Contact created successfully', contactId: result.insertId });
  } catch (error) {
    console.error('Create Contact Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getContacts = async (req, res) => {
  const userId = req.user.id;

  try {
    const [contacts] = await pool.query('SELECT * FROM contacts WHERE user_id = ?', [userId]);
    res.json({ contacts });
  } catch (error) {
    console.error('Get Contacts Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getContactById = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const contactId = req.params.id;
  const userId = req.user.id;

  try {
    const [contacts] = await pool.query('SELECT * FROM contacts WHERE id = ? AND user_id = ?', [
      contactId,
      userId,
    ]);

    if (contacts.length === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ contact: contacts[0] });
  } catch (error) {
    console.error('Get Contact By ID Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateContact = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const contactId = req.params.id;
  const userId = req.user.id;
  const { name, email, phone, address } = req.body;

  try {
    // Check if contact exists and belongs to user
    const [contacts] = await pool.query('SELECT * FROM contacts WHERE id = ? AND user_id = ?', [
      contactId,
      userId,
    ]);

    if (contacts.length === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Update contact
    await pool.query(
      'UPDATE contacts SET name = ?, email = ?, phone = ?, address = ? WHERE id = ? AND user_id = ?',
      [name || contacts[0].name, email || contacts[0].email, phone || contacts[0].phone, address || contacts[0].address, contactId, userId]
    );

    res.json({ message: 'Contact updated successfully' });
  } catch (error) {
    console.error('Update Contact Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteContact = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const contactId = req.params.id;
  const userId = req.user.id;

  try {
    // Check if contact exists and belongs to user
    const [contacts] = await pool.query('SELECT * FROM contacts WHERE id = ? AND user_id = ?', [
      contactId,
      userId,
    ]);

    if (contacts.length === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Delete contact
    await pool.query('DELETE FROM contacts WHERE id = ? AND user_id = ?', [contactId, userId]);

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Delete Contact Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
};
