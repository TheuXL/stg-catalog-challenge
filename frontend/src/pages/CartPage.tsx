// src/pages/CartPage.tsx
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { CartItem } from '../components/cart/CartItem';
import { Spinner } from '../components/common/Spinner';
import { Button } from '../components/common/Button';

export const CartPage = () => {
  const { cartItems, loading, totalPrice } = useCart();

  const formatPrice = (price: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

  if (loading) {
    return <div className="flex justify-center"><Spinner /></div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Seu carrinho está vazio</h1>
        <p className="mt-2 text-slate-600">Adicione produtos do catálogo para continuar.</p>
        <Button asChild className="mt-4">
          <Link to="/">Voltar ao Catálogo</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-3xl font-bold">Seu Carrinho</h1>
      <div className="rounded-lg bg-white p-6 shadow-md">
        {cartItems.map(item => (
          <CartItem key={item.products.id} item={item} />
        ))}
        <div className="mt-6 flex justify-end">
          <div className="text-right">
            <p className="text-lg">Total:</p>
            <p className="text-2xl font-bold">{formatPrice(totalPrice)}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          <Button variant="outline" asChild>
            <Link to="/">Continuar Comprando</Link>
          </Button>
          <Button asChild>
            <Link to="/checkout">Finalizar Pedido</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

// Precisamos ajustar o componente Button para aceitar a prop `asChild`
// e também adicionar uma variante 'outline'
