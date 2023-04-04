import jwt from 'jsonwebtoken';
import Models from '../models/models.js';

const { User } = Models;

const generateAccessToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

const authenticateJWT = (req, res, next) => {
  console.log('Authenticating JWT');

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log('No authentication header found');
    return res.sendStatus(401);
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        console.log('Token has expired');

        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
          console.log('No refresh token found');
          return res.sendStatus(401);
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, payload) => {
          if (err) {
            console.log('Error verifying refresh token:', err);
            return res.sendStatus(401);
          }

          const user = await User.findById(payload.user._id);

          if (!user) {
            console.log('User not found');
            return res.sendStatus(401);
          }

          console.log('Generating new access token');
          const accessToken = generateAccessToken(user);

          res.cookie('accessToken', accessToken, { httpOnly: true });
          req.user = payload.user;

          next();
        });
      } else {
        console.log('Error verifying access token:', err);
        return res.sendStatus(403);
      }
    } else {
      console.log('Token is valid');
      req.user = payload.user;
      next();
    }
  });
};

export { authenticateJWT, generateAccessToken, generateRefreshToken };
