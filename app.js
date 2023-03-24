import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import { config } from 'dotenv';
import { User, Post, Message } from './models';
import authRoutes from './routes/authRoutes';


config();

const app = express();
app.use(cors());
app.use(json());

const MONGODB_URI = process.env.MONGODB_URI;

connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error('MongoDB connection error', error.message)
);
app.use(passport.initialize());
app.use('/', authRoutes);

const findOrCreateUser = async (profile, provider) => {
    const existingUser = await User.findOne({ [`${provider}Id`]: profile.id });
  
    if (existingUser) {
      return existingUser;
    }
  
    const newUser = new User({
      username: `${provider}_${profile.id}`,
      displayName: profile.displayName,
      email: profile.emails[0].value,
      photoURL: profile.photos[0].value,
      [`${provider}Id`]: profile.id,
    });
  
    return await newUser.save();
  };
  

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await findOrCreateUser(profile, 'google');
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'displayName', 'email', 'picture.type(large)'],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await findOrCreateUser(profile, 'facebook');
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

app.get('/', (req, res) => {
    res.send('Welcome to the Compadre Padeiro API');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

