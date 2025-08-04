// src/api/routes/cart.routes.ts
import { Router } from 'express';
import * as cartController from '../controllers/cart.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Todas as rotas de carrinho precisam de autenticação
router.use(authMiddleware);

router.get('/', cartController.getCart);
router.post('/', cartController.addItemToCart);
// Para remover um item específico: /api/cart/items/123 (onde 123 é o product_id)
router.delete('/items/:productId', cartController.removeCartItem);
// Para limpar o carrinho inteiro
router.delete('/', cartController.clearCart);

export { router as cartRoutes };
