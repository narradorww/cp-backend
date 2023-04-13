import express from 'express';
import passport from '../config/auth.js';
import Baker from '../models/Baker.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const authRouter = express.Router();

authRouter.post('/login', (req, res, next) => {
  console.log('Login request received. Body:', req.body);
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({ message: 'Login failed', user, info });
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
      return res.json({ user, token });
    });
  })(req, res, next);
});

authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authRouter.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.json({ user: req.user, token });
});


authRouter.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

authRouter.get('/facebook/callback', passport.authenticate('facebook', { session: false }), (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.json({ user: req.user, token });
});

authRouter.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await Baker.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Teste a senha inserida e a senha criptografada antes de salvar no banco de dados
    const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
    console.log('Password test during registration. Provided:', password, 'Hashed:', hashedPassword, 'Result:', isPasswordMatch);

    const newUser = new Baker({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating user', error: err });
  }
});


export default authRouter;