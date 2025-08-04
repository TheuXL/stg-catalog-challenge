// src/components/layout/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export const Header = () => {
  const { user } = useAuth();
  const { cartItems } = useCart();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Erro ao sair');
    }
  };

  const cartItemCount = cartItems.reduce((acc: number, item: { quantity: number }) => acc + item.quantity, 0);

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-2xl font-bold text-slate-900">
          STG Catalog
        </Link>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-slate-600">Olá, {user?.email}</span>
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-6 w-6 text-slate-700" />
            {cartItemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {cartItemCount}
              </span>
            )}
          </Link>
          <button onClick={handleLogout} title="Sair">
            <LogOut className="h-6 w-6 text-slate-700" />
          </button>
        </div>
      </nav>
    </header>
  );
};
