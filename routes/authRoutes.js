import express from 'express';
import { authController } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.delete('/users/:id', authController.deleteUser);

export const authRouter = router;
