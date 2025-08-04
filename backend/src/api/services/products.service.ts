// src/api/services/products.service.ts
import { supabase } from '../../config/supabaseClient';

export const findAllProducts = async (searchTerm?: string) => {
  let query = supabase.from('products').select('*');

  if (searchTerm) {
    // ilike é case-insensitive
    query = query.ilike('name', `%${searchTerm}%`);
  }
  
  const { data, error } = await query.order('name', { ascending: true });
  if (error) throw new Error(error.message);
  return data;
};

export const findProductById = async (id: number) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  // Se o erro é que nenhuma linha foi encontrada, retornamos null.
  // O controlador irá transformar isso em um 404 Not Found.
  if (error && error.code === 'PGRST116') {
    return null;
  }

  // Para qualquer outro tipo de erro, nós o lançamos.
  if (error) throw new Error(error.message);
  
  return data;
};
