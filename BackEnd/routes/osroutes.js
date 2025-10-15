// Import Express framework for routing
import express from 'express';
// Import OS controller function for retrieving operating systems
import { getAllOS } from '../controllers/oscontroller.js';

// Create a new Express router instance
const router = express.Router();

// Routes for operating system filters
// GET / - Retrieve all available operating systems for filtering tools
router.get('/', getAllOS);

// Export the router to be used in the main application
export default router;