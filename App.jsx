import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { StoreProvider } from './hooks/useStore';
import { AuthProvider } from './hooks/useAuth';
import { ToastProvider } from './hooks/useToast';
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/customer/Home';
import Menu from './pages/customer/Menu';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import OrderConfirmation from './pages/customer/OrderConfirmation';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';
import Customers from './pages/admin/Customers';
import Analytics from './pages/admin/Analytics';
import Settings from './pages/admin/Settings';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <StoreProvider>
          <AuthProvider>
            <Routes>
              <Route element={<CustomerLayout />}>
                <Route index element={<Home />} />
                <Route path="menu" element={<Menu />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="order/:id" element={<OrderConfirmation />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<Orders />} />
                <Route path="customers" element={<Customers />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Route>
            </Routes>
          </AuthProvider>
        </StoreProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
