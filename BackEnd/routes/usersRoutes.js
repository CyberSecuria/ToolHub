// Import Express framework for routing
import express from 'express';
// Import user controller functions for managing users and authentication
import { createUser, getAllUsers, getUserById, updateUser, deleteUser, loginUser, signupUser, verifyToken } from '../controllers/usersController.js';
// Import authentication middleware for protecting routes
import { requireAuth, requireOwnership, requireAdminOrOwnership } from '../middleware/authMiddleware.js';

// Create a new Express router instance
const router = express.Router();

// Authentication routes (must be before generic routes to avoid conflicts)
// POST /login - Authenticate user with email and password
router.post('/login', loginUser);
// POST /signup - Register a new user account
router.post('/signup', signupUser);
// POST /verify - Verify JWT token validity
router.post('/verify', verifyToken);

// CRUD routes for user management
// GET / - Retrieve all users from the database
router.get('/', getAllUsers);
// POST /create - Create a new user (admin only, changed from '/' to avoid conflicts)
router.post('/create', createUser);
// GET /:id - Get a specific user by ID (protected - admin or owner only)
router.get('/:id', requireAuth, requireAdminOrOwnership, getUserById);
// PATCH /:id - Update user information (protected - admin or owner only)
router.patch('/:id', requireAuth, requireAdminOrOwnership, updateUser);
// DELETE /:id - Delete a user account (protected - admin or owner only)
router.delete('/:id', requireAuth, requireAdminOrOwnership, deleteUser);

// Export the router to be used in the main application
export default router;
