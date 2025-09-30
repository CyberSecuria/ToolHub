import express from 'express';
import { getAllResources, getResourceById, createResource, updateResource, deleteResource } from '../controllers/resourcesController.js';

const router = express.Router();

router.get('/', getAllResources);
router.get('/:id', getResourceById);
router.post('/', createResource);
router.patch('/:id', updateResource);
router.delete('/:id', deleteResource);

export default router;



