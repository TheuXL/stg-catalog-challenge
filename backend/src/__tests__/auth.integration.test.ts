import request from 'supertest';
import { app, server } from '../server';
import { createTestUser, deleteTestUser, getAuthToken } from './utils/auth.helper';
import * as authService from '../api/services/auth.service';

jest.mock('../api/services/auth.service', () => ({
  ...jest.requireActual('../api/services/auth.service'),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
}));

describe('Integração: Autenticação de Usuário', () => {
  let testUser: any;

  // Roda ANTES de CADA teste
  beforeEach(async () => {
    testUser = await createTestUser();
  });

  // Roda DEPOIS de CADA teste
  afterEach(async () => {
    if (testUser?.id) {
      await deleteTestUser(testUser.id);
    }
  });

  // Roda UMA VEZ após todos os testes deste arquivo
  afterAll(() => {
    server.close();
  });

  test('deve registrar um novo usuário com sucesso', () => {
    expect(testUser).toBeDefined();
  });

  test('deve logar um usuário existente e retornar um token', async () => {
    const token = await getAuthToken(testUser.email);
    expect(token).toBeDefined();
  });

  test('deve retornar erro ao tentar logar com senha incorreta', async () => {
    await expect(getAuthToken(testUser.email, 'wrongpassword'))
      .rejects.toThrow('Invalid login credentials');
  });

  test('deve chamar o endpoint de recuperação de senha com sucesso', async () => {
    const spy = jest.spyOn(authService, 'sendPasswordResetEmail');
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: testUser.email });

    expect(res.statusCode).toEqual(200);
    expect(spy).toHaveBeenCalledWith(testUser.email);
    spy.mockRestore();
  });
});
