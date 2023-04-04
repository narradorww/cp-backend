import express from 'express';
import { getPosts, getPost, createPost, updatePost, deletePost } from '../controllers/postController.js';
import {authenticateJWT} from '../middleware/authenticateJWT.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', authenticateJWT, createPost);
router.put('/:id', authenticateJWT, updatePost);
router.delete('/:id', authenticateJWT, deletePost);

export default router;

