import express from 'express';
import { getAllOS } from '../controllers/oscontroller.js';

const router = express.Router();

// Routes pour les filtres

router.get('/', getAllOS);


export default router;