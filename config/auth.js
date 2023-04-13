import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Baker from '../models/Baker.js';

// Load environment variables
dotenv.config();

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
async (email, password, done) => {
  console.log('Authenticating user with email:', email); // Adicionar log do email

  try {
    const user = await Baker.findOne({ email });

    if (!user) {
      console.log('User not found'); // Adicionar log se o usuário não for encontrado
      return done(null, false, { message: 'Invalid email or password' });
    }

    console.log('Comparing passwords. Provided:', password, 'Stored:', user.password); // Adicionar log das senhas
    if (!user.validPassword(password)) {
      console.log('Invalid password'); // Adicionar log se a senha for inválida
      return done(null, false, { message: 'Invalid email or password' });
    }

    return done(null, user);
  } catch (err) {
    console.log('Error during authentication:', err); // Adicionar log se ocorrer um erro
    return done(err);
  }
}
));



// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await Baker.findOne({ authProvider: 'google', authId: profile.id });

      if (existingUser) {
        return done(null, existingUser);
      }

      const newUser = new Baker({
        authProvider: 'google',
        authId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value
      });

      await newUser.save();

      const tokenPayload = {
        id: newUser._id,
        email: newUser.email,
      };

      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '24h' });

      return done(null, newUser, { token });
    } catch (err) {
      return done(err);
    }
  }
));

// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await Baker.findOne({ authProvider: 'facebook', authId: profile.id });

      if (existingUser) {
        return done(null, existingUser);
      }

      const newUser = new Baker({
        authProvider: 'facebook',
        authId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value
      });

      await newUser.save();

      const tokenPayload = {
        id: newUser._id,
        email: newUser.email,
      };

      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '24H' });

      return done(null, newUser, { token });
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Baker.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;

