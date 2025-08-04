// src/config/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  throw new Error("As variáveis de ambiente SUPABASE_URL, SUPABASE_ANON_KEY, e SUPABASE_SERVICE_ROLE_KEY são obrigatórias.");
}

// Cliente público, usado para operações que não exigem privilégios
// ou para tabelas com RLS que podem ser acessadas por usuários anônimos.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente com privilégios de administrador (service_role).
// Usado para operações no backend que precisam ignorar as políticas de RLS.
// A segurança é garantida pela lógica da nossa própria API.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
