import request from 'supertest';
import express from 'express';
import { apiRoutes } from '../api/routes';
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

describe('Integração: Endpoints de Produtos', () => {
  
  test('deve buscar uma lista de produtos do banco de dados', async () => {
    const res = await request(app).get('/api/products');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThanOrEqual(12); 
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('name');
  });

  test('deve buscar um único produto pelo ID', async () => {
    const res = await request(app).get('/api/products/1');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', 1);
    expect(res.body.name).toEqual('Smartphone Galaxy S23');
  });

  test('deve filtrar produtos pelo termo de busca', async () => {
    const res = await request(app).get('/api/products?search=Galaxy');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toContain('Galaxy');
  });

  // Este teste agora deve passar graças à correção no `products.service.ts`
  test('deve retornar 404 para um produto inexistente', async () => {
    const res = await request(app).get('/api/products/999999');
    
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error', 'Product not found');
  });
});
