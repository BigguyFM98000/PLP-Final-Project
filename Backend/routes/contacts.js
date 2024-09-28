// routes/contacts.js
const express = require('express');
const { body, param } = require('express-validator');
const {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
} = require('../controllers/contactController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(authenticateToken);

// Create a new contact
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().optional(),
    body('phone').optional(),
    body('address').optional(),
  ],
  createContact
);

// Get all contacts for the authenticated user
router.get('/', getContacts);

// Get a single contact by ID
router.get(
  '/:id',
  [param('id').isInt().withMessage('Contact ID must be an integer')],
  getContactById
);

// Update a contact by ID
router.put(
  '/:id',
  [
    param('id').isInt().withMessage('Contact ID must be an integer'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').isEmail().optional(),
    body('phone').optional(),
    body('address').optional(),
  ],
  updateContact
);

// Delete a contact by ID
router.delete(
  '/:id',
  [param('id').isInt().withMessage('Contact ID must be an integer')],
  deleteContact
);

module.exports = router;
