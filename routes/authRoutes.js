import express from 'express';
import { authController } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.delete('/users/:id', authMiddleware, authController.deleteUser);
router.get('/users/me', authMiddleware, authController.me);

export const authRouter = router;
