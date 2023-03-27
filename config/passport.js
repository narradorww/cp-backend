import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import passport from 'passport';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Models from '../models/models.js';

const { User, Post, Message } = Models;

const findOrCreateUser = async (profile) => {
  try {
    let user = await User.findOne({ socialId: profile.id });

    if (user) {
      return user;
    }

    const email = profile.emails ? profile.emails[0].value : '';
    if (email) {
      user = await User.findOne({ email });

      if (user) {
        // Atualize o socialId e o provedor do usuário existente, se necessário
        user.socialId = profile.id;
        user.provider = profile.provider;
        await user.save();
        return user;
      }
    }

    const username = email || `${profile.provider}_${profile.id}`;

    const newUser = new User({
      socialId: profile.id,
      displayName: profile.displayName,
      email,
      username,
      provider: profile.provider,
    });

    await newUser.save();
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await findOrCreateUser(profile);

      if (user) {
        const token = jwt.sign({ user }, process.env.JWT_SECRET);
        done(null, { user, token });
      } else {
        done(new Error('Error creating or finding user'), null);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: '/auth/facebook/callback',
      profileFields: ['id', 'email', 'displayName'],
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await findOrCreateUser(profile);

      if (user) {
        const token = jwt.sign({ user }, process.env.JWT_SECRET);
        done(null, { user, token });
      } else {
        done(new Error('Error creating or finding user'), null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
