// Import Express framework for routing
import express from 'express';
// Import platforms controller function for retrieving available platforms
import { getAllPlatforms } from '../controllers/platformscontroller.js';

// Create a new Express router instance
const router = express.Router();

// GET / - Retrieve all available platforms for filtering tools
router.get('/', getAllPlatforms);

// Export the router to be used in the main application
export default router;