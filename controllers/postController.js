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
  function getUserID(userData){
    return userData.user._id;
  }
  try {
    console.log('Objeto enviado:', req.body);
    console.log('O usuario é:', req.user); 
        // adicionando o log
    const { title, description, type } = req.body;
    const data = req.user
    const userId = getUserID(data);
    console.log('O _id do usuário é:', userId);
    const post = new Post({ title, description, type, userId });

    const result = await post.save();

    res.status(201).json({ message: 'Post criado com sucesso', post: result });
  } catch (error) {
    console.error(error);
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
  const postId = req.params.id;
  const userId = req.user._id;

  try {
    const post = await Post.findOne({ _id: postId });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.userId.toString() !== userId.toString() && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await post.remove();

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};
