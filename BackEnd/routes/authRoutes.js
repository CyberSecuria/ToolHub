// Import Express framework for routing
import express from 'express';
// Import authentication controller functions
import { register, login, refresh, logout, me } from '../controllers/authController.js';
// Import authentication middleware for protected routes
import { requireAuth } from '../middleware/authMiddleware.js';

// Create a new Express router instance
const router = express.Router();

// POST /register - Register a new user account
router.post('/register', register);
// POST /login - Authenticate user and return JWT tokens
router.post('/login', login);
// POST /refresh - Refresh access token using refresh token
router.post('/refresh', refresh);
// POST /logout - Invalidate user session and tokens
router.post('/logout', logout);
// GET /me - Get current authenticated user information (protected route)
router.get('/me', requireAuth, me);

// Export the router to be used in the main application
export default router;
