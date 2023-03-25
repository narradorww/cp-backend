import { Router } from 'express';
import passport from './passportWrapper.cjs';
const router = Router();

// Rotas de autenticação do Google
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Redirecione para a página inicial após o login bem-sucedido
    res.redirect('/');
  }
);

// Rotas de autenticação do Facebook
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    // Redirecione para a página inicial após o login bem-sucedido
    res.redirect('/');
  }
);

export default router;
