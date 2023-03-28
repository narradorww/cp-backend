import path from 'path';
import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import authenticateJWT from '../middleware/authenticateJWT.js';

dotenv.config();

const router = express.Router();

const generateJwtToken = (user) => {
  const accessToken = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ user }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
};


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  const tokens = generateJwtToken(req.user);
  res.redirect(`http://localhost:3000/auth-redirect?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`);
});

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), (req, res) => {
  const tokens = generateJwtToken(req.user);
  res.redirect(`http://localhost:3000/auth-redirect?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`);
});

router.get('/protected', authenticateJWT, (req, res) => {
  const user = req.user;
  res.json(user);
});

router.get('/success', (req, res) => {
  const token = req.query.token;
  if (token) {
    // Aqui você pode renderizar uma página de sucesso ou redirecionar para outra rota
    // Por exemplo, você pode enviar o token para o front-end e armazená-lo no localStorage
    res.redirect(`/sucess.html`);
  } else {
    res.status(400).send('<h1>Falha na autenticação</h1>');
  }
});
;

router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newTokens = generateJwtToken(decoded.user);

    res.json({
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
    });
  } catch (error) {
    res.status(403).json({ error: 'Invalid refresh token' });
  }
});



export default router;
