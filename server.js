import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import recipeRoutes from './routes/recipeRoutes.js';
import bakerRoutes from './routes/bakerRoutes.js';
import postRoutes from './routes/postRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import authRouter from './routes/authRouter.js';
import auth from './config/auth.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(auth.initialize());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Authentication routes
app.get('/auth/google', auth.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', auth.authenticate('google'), (req, res) => {
  // Handle successful authentication here
});

app.get('/auth/facebook', auth.authenticate('facebook', { scope: ['email'] }));
app.get('/auth/facebook/callback', auth.authenticate('facebook'), (req, res) => {
  // Handle successful authentication here
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/recipes', recipeRoutes);
app.use('/api/bakers', bakerRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/sourdoughstarterdonations', donationRoutes);

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));
