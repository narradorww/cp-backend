// ./middleware/authenticateJWT.js

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const authenticatedJWT = (req, res, next) => {
  if (req.user) {
    console.log('Usuário autenticado');
    next();
  } else {
    console.log('Usuário não autenticado');
    res.sendStatus(401);
  }
};

export default authenticatedJWT;
