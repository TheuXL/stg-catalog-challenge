// src/api/index.ts
import axios from 'axios';
import { supabase } from '../lib/supabase';

const getBaseURL = () => {
  if (import.meta.env.PROD) {
    return '/api';
  }
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
});

// Interceptor para adicionar o token JWT em todas as requisições
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export { api };
