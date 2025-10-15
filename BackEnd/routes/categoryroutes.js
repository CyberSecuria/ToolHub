// Import Express framework for routing
import express from 'express';
// Import category controller functions for managing tool categories
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categorycontroller.js';

// Create a new Express router instance
const router = express.Router();

// Routes for category management
// GET / - Retrieve all categories from the database
router.get('/', getAllCategories);
// POST / - Create a new category
router.post('/', createCategory);
// PATCH /:id - Update an existing category by ID
router.patch('/:id', updateCategory);
// DELETE /:id - Delete a category by ID
router.delete('/:id', deleteCategory);

// Export the router to be used in the main application
export default router;