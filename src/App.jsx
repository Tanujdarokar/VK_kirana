import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';
import { FinanceProvider } from './context/FinanceContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { OrderProvider } from './context/OrderContext';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { KiranaAIFloatingButton } from './components/ai/KiranaAIFloatingButton';

// Customer Storefront Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrdersPage } from './pages/OrdersPage';
import { WishlistPage } from './pages/WishlistPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Kirana Store Owner & Business Money Management Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { InventoryManagerPage } from './pages/admin/InventoryManagerPage';
import { PosBillingPage } from './pages/admin/PosBillingPage';
import { KhataBookPage } from './pages/admin/KhataBookPage';
import { ExpenseTrackerPage } from './pages/admin/ExpenseTrackerPage';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <InventoryProvider>
          <FinanceProvider>
            <CartProvider>
              <WishlistProvider>
                <OrderProvider>
                  <Router>
                    <ScrollToTop />
                    <Routes>
                      {/* Store Owner & Business Money Management Admin Routes */}
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route path="/admin/inventory" element={<InventoryManagerPage />} />
                      <Route path="/admin/pos" element={<PosBillingPage />} />
                      <Route path="/admin/khata" element={<KhataBookPage />} />
                      <Route path="/admin/expenses" element={<ExpenseTrackerPage />} />

                      {/* Customer Storefront Routes with Main Navbar & Footer */}
                      <Route
                        path="/*"
                        element={
                          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                            <Navbar />
                            <main style={{ flex: 1 }}>
                              <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/products" element={<ProductsPage />} />
                                <Route path="/category/:category" element={<CategoryPage />} />
                                <Route path="/product/:id" element={<ProductDetailsPage />} />
                                <Route path="/cart" element={<CartPage />} />
                                <Route path="/wishlist" element={<WishlistPage />} />
                                <Route path="/checkout" element={<CheckoutPage />} />
                                <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
                                <Route path="/orders" element={<OrdersPage />} />
                                <Route path="/profile" element={<ProfilePage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/register" element={<RegisterPage />} />
                                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                                <Route path="*" element={<NotFoundPage />} />
                              </Routes>
                            </main>
                            <KiranaAIFloatingButton />
                            <Footer />
                          </div>
                        }
                      />
                    </Routes>
                  </Router>
                </OrderProvider>
              </WishlistProvider>
            </CartProvider>
          </FinanceProvider>
        </InventoryProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
