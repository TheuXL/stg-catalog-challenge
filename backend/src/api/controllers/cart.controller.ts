// src/api/controllers/cart.controller.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import * as cartService from '../services/cart.service';

export const getCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const cart = await cartService.findCartByUserId(userId);
    res.status(200).json(cart);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addItemToCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    
    if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({ error: "ID do produto e uma quantidade válida são obrigatórios." });
    }

    const updatedItem = await cartService.upsertCartItem(userId, productId, quantity);
    res.status(201).json(updatedItem);
  } catch (error: any) {
    console.error('Erro ao adicionar item ao carrinho:', error.message); // Log do erro real
    res.status(500).json({ error: 'Erro interno ao adicionar item ao carrinho.', details: error.message });
  }
};

export const removeCartItem = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const productId = parseInt(req.params.productId, 10);
    await cartService.removeCartItem(userId, productId);
    res.status(204).send(); // No content
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const clearCart = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user.id;
        await cartService.clearUserCart(userId);
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
