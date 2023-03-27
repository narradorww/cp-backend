import Models from '../models/models.js';

const { User, Post, Message } = Models;

const createPost = async (req, res) => {
  try {
    const { userId, title, description, type } = req.body;

    // Cria um novo post com os dados recebidos do cliente
    const newPost = new Post({
      userId,
      title,
      description,
      type,
    });

    // Salva o post no banco de dados
    const savedPost = await newPost.save();

    // Retorna o post criado para o cliente
    res.status(201).json(savedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar post' });
  }
};

const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, description } = req.body;

    // Busca o post no banco de dados pelo ID e atualiza os campos passados pelo cliente
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, description },
      { new: true }
    );

    // Retorna o post atualizado para o cliente
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar post' });
  }
};

const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Remove o post do banco de dados pelo ID
    await Post.findByIdAndRemove(postId);

    // Retorna uma mensagem de sucesso para o cliente
    res.status(200).json({ message: 'Post removido com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao remover post' });
  }
};

export { createPost, updatePost, deletePost };
