import express from 'express';
import Post from '../models/Post.js';

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a post by ID
router.get('/:id', getPost, (req, res) => {
  res.json(res.post);
});

// Create a new post
router.post('/', async (req, res) => {
  const post = new Post(req.body);

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a post
router.patch('/:id', getPost, async (req, res) => {
  Object.assign(res.post, req.body);

  try {
    const updatedPost = await res.post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a post
router.delete('/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const deletedPost = await Post.findByIdAndRemove(postId);

    if (!deletedPost) {
      res.status(404).json({ message: 'Post not found' });
    }
    else {
      res.json({ message: 'Deleted post' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

});

// Middleware to fetch a post by ID
async function getPost(req, res, next) {
  let post;

  try {
    post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Cannot find post' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.post = post;
  next();
}

export default router;
