import jwt from 'jsonwebtoken';

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log('Erro ao verificar o token:', err);
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    console.log('Usuário não autenticado');
    res.sendStatus(401);
  }
};

export default authenticateJWT;

