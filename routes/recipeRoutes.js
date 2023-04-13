import express from 'express';
import Recipe from '../models/Recipe.js';

const router = express.Router();

// Get all recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a recipe by ID
router.get('/:id', getRecipe, (req, res) => {
  res.json(res.recipe);
});

// Create a new recipe
router.post('/', async (req, res) => {
  const recipe = new Recipe(req.body);

  try {
    const newRecipe = await recipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a recipe
router.patch('/:id', getRecipe, async (req, res) => {
  Object.assign(res.recipe, req.body);

  try {
    const updatedRecipe = await res.recipe.save();
    res.json(updatedRecipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a recipe
router.delete('/:id',  async (req, res) => {
  try {
    const recipeId = req.params.id;
    const deletedRecipe = await Recipe.findByIdAndRemove(recipeId);

    if (!deletedRecipe) {
        res.status(404).json({ message: 'Recipe not found' });
        } else {
        res.json({ message: 'Deleted recipe' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to fetch a recipe by ID
async function getRecipe(req, res, next) {
  let recipe;

  try {
    recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Cannot find recipe' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.recipe = recipe;
  next();
}

export default router;
