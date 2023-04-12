import mongoose from 'mongoose';

const { Schema } = mongoose;

const ingredientSchema = new Schema({
  name: String,
  quantity: Number,
  unit: String,
});

const recipeSchema = new Schema({
  title: String,
  ingredients: [ingredientSchema],
  preparationTime: Number,
  fermentationTime: Number,
  materials: [String],
  instructions: String,
  bakerId: { type: Schema.Types.ObjectId, ref: 'Baker' },
});

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;

