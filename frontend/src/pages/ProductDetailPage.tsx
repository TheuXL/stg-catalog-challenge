// src/pages/ProductDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import { ArrowLeft } from 'lucide-react';

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, loading: cartLoading } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get<Product>(`/products/${id}`);
        setProduct(data);
        setError(null);
      } catch (err) {
        setError('Produto não encontrado ou erro ao carregar.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
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

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
        <Link to="/" className="mt-4 inline-block text-blue-500 hover:underline">
          Voltar ao Catálogo
        </Link>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-4xl p-4">
       <Link
        to="/"
        className="mb-6 inline-flex items-center text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar ao catálogo
      </Link>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full rounded-lg object-cover shadow-lg"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="mt-2 text-slate-500">{product.category}</p>
          <p className="mt-4 text-slate-700">{product.description}</p>
          <div className="mt-6 flex-grow"></div>
          <div className="mt-4">
            <p className="text-4xl font-bold text-slate-900">
              {formatPrice(product.price)}
            </p>
            <Button
              onClick={handleAddToCart}
              className="mt-6 w-full py-3 text-lg"
              isLoading={cartLoading}
            >
              Adicionar ao Carrinho
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
