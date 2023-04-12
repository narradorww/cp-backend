import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import passport from 'passport';
import passportGoogle from 'passport-google-oauth20';
import pkg from 'passport-facebook-token';
import dotenv from 'dotenv';
import recipeRoutes from './routes/recipeRoutes.js';
import bakerRoutes from './routes/bakerRoutes.js';
import postRoutes from './routes/postRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import donationRoutes from './routes/donationRoutes.js';

const { Strategy: FacebookTokenStrategy } = pkg;
const { Strategy: GoogleStrategy } = passportGoogle;

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Passport configuration
// Google OAuth
passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
        authorizationURL: "https://accounts.google.com/o/oauth2/v2/auth",
        tokenURL: "https://oauth2.googleapis.com/token",
      },
      async (accessToken, refreshToken, profile, done) => {
        // Aqui você pode implementar a lógica para vincular o perfil do Google ao usuário no seu banco de dados
      }
    )
  )

// Facebook Token
passport.use(
    new FacebookTokenStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        authorizationURL: "https://www.facebook.com/dialog/oauth",
        tokenURL: "https://graph.facebook.com/oauth/access_token",
      },
      async (accessToken, refreshToken, profile, done) => {
        // Aqui você pode implementar a lógica para vincular o perfil do Facebook ao usuário no seu banco de dados
      }
    )
  );

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/bakers', bakerRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/sourdoughstarterdonations', donationRoutes);

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));
