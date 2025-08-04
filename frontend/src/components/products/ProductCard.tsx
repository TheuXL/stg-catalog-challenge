// src/components/products/ProductCard.tsx
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { Button } from '../common/Button';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import React from 'react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, loading: isCartLoading } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Impede a navegação ao clicar no botão
    e.stopPropagation(); // Impede a propagação do evento para o Link pai
    try {
      await addToCart(product.id, 1);
      toast.success(`${product.name} adicionado ao carrinho!`);
    } catch (error) {
      toast.error('Erro ao adicionar produto ao carrinho.');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <Link to={`/product/${product.id}`} className="group flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl">
      <div className="overflow-hidden">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-110" 
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-bold text-slate-800">{product.name}</h3>
        <p className="mt-1 text-sm text-slate-500">{product.category}</p>
        <div className="flex-grow" />
        <p className="mt-4 text-xl font-semibold text-slate-900">{formatPrice(product.price)}</p>
        <div className="mt-4">
          <Button 
            onClick={handleAddToCart} 
            className="w-full" 
            isLoading={isCartLoading}
          >
            Adicionar ao Carrinho
          </Button>
        </div>
      </div>
    </Link>
  );
};
