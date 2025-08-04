// src/api/routes/auth.routes.ts
import { Router } from 'express';
import * as authController from '../controllers/auth.controller';

const router = Router();

// Endpoint público para solicitar a recuperação de senha
router.post('/forgot-password', authController.forgotPassword);

export { router as authRoutes };
