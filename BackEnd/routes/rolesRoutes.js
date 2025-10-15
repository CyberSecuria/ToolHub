// Import Express framework for routing
import express from 'express';
// Import role controller functions for handling role operations
import { getAllRoles, updateRole } from '../controllers/rolesController.js';

// Create a new Express router instance
const router = express.Router();

// Routes for roles management
// GET / - Retrieve all roles from the database
router.get('/', getAllRoles);
// PATCH /:id - Update a specific role by ID
router.patch('/:id', updateRole);

// Export the router to be used in the main application
export default router;
