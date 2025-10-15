// Import Express framework for routing
import express from 'express';
// Import resource controller functions for managing educational resources
import { getAllResources, getResourceById, createResource, updateResource, deleteResource } from '../controllers/resourcesController.js';

// Create a new Express router instance
const router = express.Router();

// GET / - Retrieve all resources from the database
router.get('/', getAllResources);
// GET /:id - Get a specific resource by ID
router.get('/:id', getResourceById);
// POST / - Create a new resource
router.post('/', createResource);
// PATCH /:id - Update an existing resource by ID
router.patch('/:id', updateResource);
// DELETE /:id - Delete a resource by ID
router.delete('/:id', deleteResource);

// Export the router to be used in the main application
export default router;



