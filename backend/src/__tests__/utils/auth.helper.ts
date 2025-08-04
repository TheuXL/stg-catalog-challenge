// src/__tests__/utils/auth.helper.ts
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('As variáveis de ambiente SUPABASE_URL, SUPABASE_ANON_KEY, e SUPABASE_SERVICE_ROLE_KEY são necessárias.');
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

/**
 * Cria um novo usuário de teste com um e-mail único.
 * @returns {Promise<any>} O objeto do usuário criado.
 */
export async function createTestUser() {
  const email = `test.user.${Date.now()}@example.com`;
  const password = 'password123';

  // Usamos a API de Admin para criar o usuário, que não requer confirmação de e-mail.
  // Esta é a forma correta para ambientes de backend e testes.
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Já marca o e-mail como confirmado.
  });

  if (error) {
    throw new Error(`Erro ao criar usuário de teste via Admin API: ${error.message}`);
  }
  return data.user;
}

/**
 * Deleta um usuário de teste pelo seu ID.
 * @param {string} userId - O ID do usuário a ser deletado.
 */
export async function deleteTestUser(userId: string) {
  if (!userId) return;
  await supabaseAdmin.auth.admin.deleteUser(userId);
}

/**
 * Faz login com um usuário e retorna o token de acesso.
 * @param {string} email - O email do usuário.
 * @param {string} password - A senha do usuário.
 * @returns {Promise<string>} O token de acesso JWT.
 */
export async function getAuthToken(email: string, password = 'password123'): Promise<string> {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error || !data.session?.access_token) {
        throw new Error(`Falha ao obter token de autenticação: ${error?.message || 'Sessão não encontrada'}`);
    }
    return data.session.access_token;
}
