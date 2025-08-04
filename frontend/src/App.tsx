// src/App.tsx
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { AppRoutes } from './routes';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppRoutes />
        <Toaster position="top-right" />
      </CartProvider>
    </AuthProvider>
  );
}
export default App;
