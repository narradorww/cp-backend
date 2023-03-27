import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import Models from '../models/models.js';

const { User, Post, Message } = Models;

const passportWrapper = () => {
    console.log(process.env.GOOGLE_CLIENT_ID);
console.log(process.env.GOOGLE_CLIENT_SECRET);
  passport.use(
    new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
      // Save user to MongoDB or retrieve existing user
      // Generate JWT token
    })
  );

  passport.use(
    new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: '/auth/facebook/callback',
      profileFields: ['id', 'email', 'displayName']
    }, async (accessToken, refreshToken, profile, done) => {
      // Save user to MongoDB or retrieve existing user
      // Generate JWT token
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (_id, done) => {
    // Substitua isso pela lógica de busca do usuário no seu banco de dados.
    const user = await User.findById(_id);
    done(null, user);
  });

  return passport;
};

export default passportWrapper();


