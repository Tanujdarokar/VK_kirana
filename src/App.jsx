import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { ShieldAlert, Store, ArrowRight } from 'lucide-react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
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

// Vendor Guard Wrapper
function VendorRoute({ children }) {
  const { isVendor, user } = useAuth();

  if (!isVendor) {
    return (
      <div style={{ padding: '60px 20px 80px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9' }}>
        <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '36px 32px', textAlign: 'center', borderTop: '6px solid #0f172a' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 20px rgba(239, 68, 68, 0.15)' }}>
            <ShieldAlert size={34} />
          </div>

          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#dc2626', backgroundColor: '#fee2e2', padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase' }}>
            Vendor Access Restricted
          </span>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '12px 0 8px' }}>
            Store Owner / Dukan Access Only
          </h2>

          <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '20px' }}>
            You are currently logged in as {user ? <strong>{user.name} ({user.email})</strong> : 'a Customer'}.
            Khata Book, POS Counter Billing, Inventory, and Shop Expenses management are restricted to <strong>Vendor / Shopkeeper</strong> accounts.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link
              to="/login"
              className="btn btn-primary"
              style={{ backgroundColor: '#0f172a', borderColor: '#1e293b', justifyContent: 'center' }}
            >
              <Store size={18} color="#34d399" />
              <span>Sign In as Vendor / Shopkeeper</span>
            </Link>

            <Link to="/products" className="btn btn-outline" style={{ justifyContent: 'center' }}>
              <span>Return to Customer Storefront</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
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
                      {/* Store Owner & Business Money Management Admin Routes (Vendor Protected) */}
                      <Route path="/admin" element={<VendorRoute><AdminDashboard /></VendorRoute>} />
                      <Route path="/admin/inventory" element={<VendorRoute><InventoryManagerPage /></VendorRoute>} />
                      <Route path="/admin/pos" element={<VendorRoute><PosBillingPage /></VendorRoute>} />
                      <Route path="/admin/khata" element={<VendorRoute><KhataBookPage /></VendorRoute>} />
                      <Route path="/admin/expenses" element={<VendorRoute><ExpenseTrackerPage /></VendorRoute>} />

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
