// src/api/controllers/products.controller.ts
import { Request, Response } from 'express';
import * as productService from '../services/products.service';

export const listProducts = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const products = await productService.findAllProducts(search as string);
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const product = await productService.findProductById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
