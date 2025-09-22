import express from 'express';
import { createUser, getAllUsers, getUserById, updateUser, deleteUser, loginUser, signupUser, verifyToken } from '../controllers/usersController.js';

const router = express.Router();

// Authentication routes (must be before generic routes)
router.post('/login', loginUser);
router.post('/signup', signupUser);
router.post('/verify', verifyToken);

// CRUD routes
router.get('/', getAllUsers);
router.post('/create', createUser); // Changed from '/' to '/create' to avoid conflicts
router.get('/:id', getUserById);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
