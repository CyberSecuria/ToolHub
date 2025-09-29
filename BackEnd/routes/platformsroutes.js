import express from 'express';
import { getAllPlatforms } from '../controllers/platformscontroller.js';

const router = express.Router();

router.get('/', getAllPlatforms);

export default router;