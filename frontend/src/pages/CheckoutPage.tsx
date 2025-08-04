// src/pages/CheckoutPage.tsx
import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CartItem } from '../types';

export const CheckoutPage = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const formatPrice = (price: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

  const handleCheckout = () => {
    const phoneNumber = '5587988033562'; // Ex: 5511999999999

    let message = `*NOVO PEDIDO - STG CATALOG*\n\n`;
    message += `*Cliente:* ${user?.email}\n\n`;
    message += `*PRODUTOS:*\n`;

    cartItems.forEach((item: CartItem) => {
      message += `- ${item.products.name} - Qtd: ${item.quantity} - ${formatPrice(item.products.price * item.quantity)}\n`;
    });

    message += `\n*TOTAL: ${formatPrice(totalPrice)}*\n\n`;
    message += `--- \nPedido realizado via STG Catalog`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Abre o WhatsApp em uma nova aba
    window.open(whatsappUrl, '_blank');
    
    // Limpa o carrinho e redireciona
    toast.success('Pedido enviado! Limpando seu carrinho...');
    clearCart();
    navigate('/');
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold">Resumo do Pedido</h1>
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Cliente</h2>
          <p>Email: {user?.email}</p>
        </div>
        
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Produtos</h2>
          {cartItems.map(item => (
            <div key={item.products.id} className="flex justify-between py-2 border-b">
              <span>{item.products.name} (x{item.quantity})</span>
              <span>{formatPrice(item.products.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 text-right">
          <p className="text-lg">Total:</p>
          <p className="text-2xl font-bold">{formatPrice(totalPrice)}</p>
        </div>

        <div className="mt-8">
          <Button onClick={handleCheckout} className="w-full">
            Confirmar e Enviar via WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
};
