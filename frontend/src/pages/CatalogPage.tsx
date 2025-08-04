// src/pages/CatalogPage.tsx
import { useState, useEffect } from 'react';
import { api } from '../api';
import { Product } from '../types';
import { ProductCard } from '../components/products/ProductCard';
import { Spinner } from '../components/common/Spinner';
import { Input } from '../components/common/Input';

export const CatalogPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Adiciona o termo de busca como parâmetro na URL se ele existir
        const { data } = await api.get<Product[]>('/products', {
          params: { search: searchTerm || undefined },
        });
        setProducts(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    // Usamos um debounce simples para evitar chamadas à API em cada tecla digitada
    const debounceTimeout = setTimeout(() => {
      fetchProducts();
    }, 300); // Aguarda 300ms após o usuário parar de digitar

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  return (
    <div>
      <div className="mb-6">
        <Input 
          label="Buscar por nome"
          placeholder="O que você procura?"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {loading ? (
        <div className="flex justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
