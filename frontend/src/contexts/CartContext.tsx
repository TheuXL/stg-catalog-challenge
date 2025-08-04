// src/contexts/CartContext.tsx
import { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { api } from '../api';
import { useAuth } from './AuthContext';
import { CartItem } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateItemQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data } = await api.get<CartItem[]>('/cart');
      setCartItems(data);
    } catch (error) {
      console.error("Erro ao buscar carrinho:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId: number, quantity: number) => {
    await api.post('/cart', { productId, quantity });
    await fetchCart();
  };

  const removeFromCart = async (productId: number) => {
    await api.delete(`/cart/items/${productId}`);
    await fetchCart();
  };

  const updateItemQuantity = async (productId: number, quantity: number) => {
    // A API usa a mesma rota de POST para upsert
    await api.post('/cart', { productId, quantity });
    await fetchCart();
  };
  
  const clearCart = async () => {
    await api.delete('/cart');
    await fetchCart();
  };
  
  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.products.price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ cartItems, loading, addToCart, removeFromCart, updateItemQuantity, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};
