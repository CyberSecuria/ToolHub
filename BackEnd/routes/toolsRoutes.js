// Import Express framework for routing
import express from 'express';
// Import tools controller functions for managing tools in the database
import { getAllTools, getToolById, createTool, updateTool, deleteTool } from '../controllers/toolsController.js';

// Create a new Express router instance
const router = express.Router();

// GET / - Retrieve all tools from the database
router.get('/', getAllTools);
// GET /:id - Get a specific tool by ID
router.get('/:id', getToolById);
// POST / - Create a new tool (requires authentication)
router.post('/', createTool);
// PATCH /:id - Update an existing tool by ID (requires ownership or admin)
router.patch('/:id', updateTool);
// DELETE /:id - Delete a tool by ID (requires ownership or admin)
router.delete('/:id', deleteTool);

// Export the router to be used in the main application
export default router;
