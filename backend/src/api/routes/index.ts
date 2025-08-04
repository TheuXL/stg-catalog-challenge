// src/api/routes/index.ts
import { Router } from 'express';
import { productRoutes } from './products.routes';
import { cartRoutes } from './cart.routes';
import { authRoutes } from './auth.routes';

const router = Router();

router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/auth', authRoutes);

export { router as apiRoutes };
