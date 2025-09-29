import express from 'express';
import { getAllCategories } from '../controllers/categorycontroller.js';

const router = express.Router();

// Routes pour les filtres
router.get('/', getAllCategories);

export default router;