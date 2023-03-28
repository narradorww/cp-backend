import Models from '../models/models.js';

const { User, Post, Message } = Models;


// Get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('userId', 'displayName email');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar os posts', error });
  }
};

// Get a single post
export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('userId', 'displayName email');
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar o post', error });
  }
};

// Create a new post
export const createPost = async (req, res) => {
  try {
    const newPost = new Post({ ...req.body, userId: req.user._id });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar o post', error });
  }
};

// Update a post
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar o post', error });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (post) {
      res.status(200).json({ message: 'Post excluído com sucesso' });
    } else {
      res.status(404).json({ message: 'Post não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir o post', error });
  }
};