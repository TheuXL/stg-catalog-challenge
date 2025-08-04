// src/api/routes/products.routes.ts
import { Router } from 'express';
import * as productController from '../controllers/products.controller';

const router = Router();

// Rota pública para listar/buscar produtos
router.get('/', productController.listProducts);

// Rota pública para ver detalhes de um produto
router.get('/:id', productController.getProductById);

export { router as productRoutes };
