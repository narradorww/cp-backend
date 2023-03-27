import express from 'express';
import { createPost, updatePost, deletePost } from '../controllers/postController.js';
import authenticateJWT from '../middleware/authenticateJWT.js';

const router = express.Router();

router.post('/posts', authenticateJWT, createPost);
router.put('/posts/:postId', authenticateJWT, updatePost);
router.delete('/posts/:postId', authenticateJWT, deletePost);

export default router;
