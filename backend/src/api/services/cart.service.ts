// src/api/services/cart.service.ts
import { supabaseAdmin } from '../../config/supabaseClient';

// Busca o carrinho do usuário com os detalhes dos produtos
export const findCartByUserId = async (userId: string) => {
  const { data, error } = await supabaseAdmin
    .from('cart_items')
    .select(`
      quantity,
      products (
        id, name, price, image_url
      )
    `)
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
  return data;
};

// Adiciona ou atualiza um item no carrinho
export const upsertCartItem = async (userId: string, productId: number, quantity: number) => {
  // A opção onConflict diz ao Supabase para usar a combinação única de user_id e product_id
  // para decidir se deve inserir uma nova linha ou atualizar uma existente.
  const { data, error } = await supabaseAdmin
    .from('cart_items')
    .upsert({ user_id: userId, product_id: productId, quantity: quantity }, { onConflict: 'user_id,product_id' })
    .select();

  if (error) throw new Error(error.message);
  return data;
};

// Remove um item do carrinho
export const removeCartItem = async (userId: string, productId: number) => {
  const { error } = await supabaseAdmin
    .from('cart_items')
    .delete()
    .match({ user_id: userId, product_id: productId });

  if (error) throw new Error(error.message);
};

// Limpa o carrinho do usuário
export const clearUserCart = async (userId: string) => {
  const { error } = await supabaseAdmin
    .from('cart_items')
    .delete()
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
}
