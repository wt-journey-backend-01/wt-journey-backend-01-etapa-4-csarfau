import express from 'express';
import { authController } from '../controllers/authController.js';

const router = express.Router();

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);
router.delete('/users/:id', authController.deleteUser);

export const authRouter = router;
