import { Router } from 'express';
import { authenticate } from 'passport';
const router = Router();

// Rotas de autenticação do Google
router.get('/auth/google', authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Redirecione para a página inicial após o login bem-sucedido
    res.redirect('/');
  }
);

// Rotas de autenticação do Facebook
router.get('/auth/facebook', authenticate('facebook', { scope: ['email'] }));
router.get('/auth/facebook/callback', authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    // Redirecione para a página inicial após o login bem-sucedido
    res.redirect('/');
  }
);

export default router;