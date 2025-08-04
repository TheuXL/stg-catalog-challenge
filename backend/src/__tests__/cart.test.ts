import request from 'supertest';
import { app, server } from '../server'; // Importando também o servidor
import { createTestUser, deleteTestUser, getAuthToken } from './utils/auth.helper';
import { supabase } from '../config/supabaseClient';

const expressApp = app; // Renomeando para evitar conflito de nome

describe('Integração Completa: Endpoints do Carrinho', () => {
  let testUser: any;
  let authToken: string;

  beforeEach(async () => {
    testUser = await createTestUser();
    authToken = await getAuthToken(testUser.email);
    await supabase.from('cart_items').delete().eq('user_id', testUser.id);
  });

  afterEach(async () => {
    if (testUser?.id) {
      await deleteTestUser(testUser.id);
    }
  });

  // Desliga o servidor após todos os testes
  afterAll(() => {
    server.close();
  });

  test('deve falhar ao acessar o carrinho sem um token de autenticação', async () => {
    const res = await request(expressApp).get('/api/cart');
    expect(res.statusCode).toEqual(401);
  });

  test('deve iniciar com um carrinho vazio para um usuário autenticado', async () => {
    const res = await request(expressApp)
      .get('/api/cart')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  test('deve adicionar um item ao carrinho e retorná-lo', async () => {
    const res = await request(expressApp)
      .post('/api/cart')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ productId: 2, quantity: 1 });

    expect(res.statusCode).toEqual(201);
    expect(res.body[0]).toHaveProperty('product_id', 2);
  });
  
  test('deve atualizar a quantidade de um item que já está no carrinho', async () => {
    await request(expressApp).post('/api/cart').set('Authorization', `Bearer ${authToken}`).send({ productId: 3, quantity: 1 });
    const updateRes = await request(expressApp)
      .post('/api/cart')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ productId: 3, quantity: 3 });
    
    expect(updateRes.statusCode).toEqual(201);
    
    const cart = await request(expressApp).get('/api/cart').set('Authorization', `Bearer ${authToken}`);
    expect(cart.body.length).toBe(1);
    expect(cart.body[0].quantity).toBe(3);
  });

  test('deve remover um item do carrinho', async () => {
    await request(expressApp).post('/api/cart').set('Authorization', `Bearer ${authToken}`).send({ productId: 4, quantity: 1 });
    const removeRes = await request(expressApp)
      .delete('/api/cart/items/4')
      .set('Authorization', `Bearer ${authToken}`);
      
    expect(removeRes.statusCode).toEqual(204);

    const cartRes = await request(expressApp).get('/api/cart').set('Authorization', `Bearer ${authToken}`);
    expect(cartRes.body).toEqual([]);
  });
});
