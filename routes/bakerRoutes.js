import express from 'express';
import Baker from '../models/Baker.js';

const router = express.Router();

// Get all bakers
router.get('/', async (req, res) => {
  try {
    const bakers = await Baker.find();
    res.json(bakers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a baker by ID
router.get('/:id', getBaker, (req, res) => {
  res.json(res.baker);
});

// Create a new baker
router.post('/', async (req, res) => {
  const baker = new Baker(req.body);

  try {
    const newBaker = await baker.save();
    res.status(201).json(newBaker);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a baker
router.patch('/:id', getBaker, async (req, res) => {
  Object.assign(res.baker, req.body);

  try {
    const updatedBaker = await res.baker.save();
    res.json(updatedBaker);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a baker
router.delete('/:id', async (req, res) => {
    try {
      const bakerId = req.params.id;
      const deletedBaker = await Baker.findByIdAndRemove(bakerId);
  
      if (!deletedBaker) {
        res.status(404).json({ message: 'Baker not found' });
      } else {
        res.json({ message: 'Deleted baker' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  

// Middleware to fetch a baker by ID
async function getBaker(req, res, next) {
  let baker;

  try {
    baker = await Baker.findById(req.params.id);
    if (!baker) {
      return res.status(404).json({ message: 'Cannot find baker' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.baker = baker;
  next();
}

export default router;
