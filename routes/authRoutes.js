import path from 'path';
import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import authenticateJWT from '../middleware/authenticateJWT.js';

dotenv.config();

const router = express.Router();

const generateJwtToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  const token = generateJwtToken(req.user);
  res.redirect(`/success?token=${token}`);
});

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), (req, res) => {
  const token = generateJwtToken(req.user);
  res.redirect(`/success?token=${token}`);
});

router.get('/protected', authenticateJWT, (req, res) => {
  const user = req.user;
  res.json(user);
});

router.get('/success', (req, res) => {
  const token = req.query.token;
  if (token) {
    // Substitua o conteúdo do arquivo 'success.html' com o token real
    const filePath = path.join(__dirname, '../public/success.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('<h1>Erro interno do servidor</h1>');
      } else {
        const result = data.replace('YOUR_TOKEN', token);
        res.send(result);
      }
    });
  } else {
    res.status(400).send('<h1>Falha na autenticação</h1>');
  }
});

export default router;
