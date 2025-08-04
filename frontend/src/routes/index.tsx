// src/routes/index.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { AuthPage } from '../pages/AuthPage';
import { CatalogPage } from '../pages/CatalogPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { UpdatePasswordPage } from '../pages/UpdatePasswordPage'; // Importa a nova página
import { ProtectedRoute } from './ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <AuthPage />,
  },
  {
    path: '/update-password', // Nova rota pública
    element: <UpdatePasswordPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute />, // Protege o layout e todas as rotas filhas
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true, // Rota padrão -> /
            element: <CatalogPage />,
          },
          {
            path: 'cart',
            element: <CartPage />,
          },
          {
            path: 'checkout',
            element: <CheckoutPage />,
          },
          {
            path: 'product/:id',
            element: <ProductDetailPage />,
          },
        ],
      },
    ],
  },
]);

export const AppRoutes = () => <RouterProvider router={router} />;
