import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// Get all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a message by ID
router.get('/:id', getMessage, (req, res) => {
  res.json(res.message);
});

// Create a new message
router.post('/', async (req, res) => {
  const message = new Message(req.body);

  try {
    const newMessage = await message.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a message
router.patch('/:id', getMessage, async (req, res) => {
  Object.assign(res.message, req.body);

  try {
    const updatedMessage = await res.message.save();
    res.json(updatedMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a message
router.delete('/:id', getMessage, async (req, res) => {
  try {
    await res.message.remove();
    res.json({ message: 'Deleted message' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to fetch a message by ID
async function getMessage(req, res, next) {
  let message;

  try {
    message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Cannot find message' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.message = message;
  next();
}

export default router;
