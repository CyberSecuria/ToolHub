// Import Express framework for routing
import express from 'express';
// Import bookmark controller functions for managing user bookmarks
import { addBookmark, deleteBookmark, getBookmarksById, getAllBookmarks } from '../controllers/bookmarksController.js';

// Create a new Express router instance
const router = express.Router();

// POST / - Add a new bookmark for a user
router.post('/', addBookmark);
// DELETE /:id - Remove a bookmark by ID
router.delete('/:id', deleteBookmark);
// GET /:id - Get bookmarks for a specific user by user ID
router.get('/:id', getBookmarksById);
// GET / - Retrieve all bookmarks from the database
router.get('/', getAllBookmarks);

// Export the router to be used in the main application
export default router;
