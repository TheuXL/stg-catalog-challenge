// src/components/cart/CartItem.tsx
import { CartItem as CartItemType } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { Button } from '../common/Button';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem = ({ item }: CartItemProps) => {
  const { removeFromCart, updateItemQuantity, loading } = useCart();

  const handleRemove = async () => {
    try {
      await removeFromCart(item.products.id);
      toast.success(`${item.products.name} removido.`);
    } catch {
      toast.error('Erro ao remover item.');
    }
  };
  
  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateItemQuantity(item.products.id, newQuantity);
    } catch {
      toast.error('Erro ao atualizar quantidade.');
    }
  };
  
  const formatPrice = (price: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

  return (
    <div className="flex items-center space-x-4 border-b py-4">
      <img src={item.products.image_url} alt={item.products.name} className="h-20 w-20 rounded-md object-cover" />
      <div className="flex-1">
        <h3 className="font-semibold">{item.products.name}</h3>
        <p className="text-sm text-slate-600">{formatPrice(item.products.price)}</p>
      </div>
      <div className="flex items-center space-x-2">
        <input 
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
          className="w-16 rounded-md border border-slate-300 p-1 text-center"
          disabled={loading}
        />
        <Button onClick={handleRemove} disabled={loading} className="bg-red-500 hover:bg-red-700">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="w-24 text-right font-semibold">
        {formatPrice(item.products.price * item.quantity)}
      </div>
    </div>
  );
};
