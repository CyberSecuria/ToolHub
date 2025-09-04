import express from 'express';
import { addBookmark, deleteBookmark, getBookmarksById, getAllBookmarks } from '../controllers/bookmarksController.js';

const router = express.Router();

// POST /api/bookmarks
router.post('/', addBookmark);
router.delete('/:id', deleteBookmark);
router.get('/:id', getBookmarksById);
router.get('/', getAllBookmarks);


export default router;
