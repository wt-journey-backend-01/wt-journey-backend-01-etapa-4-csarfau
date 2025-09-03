import { createError } from '../utils/errorHandler.js';
import jwt from 'jsonwebtoken';
import { blacklist } from '../blacklist';

export function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return next(createError(401, 'Token inválido!'));
  }

  if(blacklist.has(token)) {
    return next(createError(401, 'Token inválido!'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(createError(401, 'Token inválido!'));
    }
    req.user = user;
    next();
  });
}
