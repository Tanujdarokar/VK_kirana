import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Calculator,
  BookOpen,
  Receipt,
  Store,
  AlertTriangle,
  TrendingUp,
  ArrowLeft,
  ShoppingBag,
  Plus
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useInventory } from '../../context/InventoryContext';

export const AdminLayout = ({ children, title, subtitle, actionButton }) => {
  const location = useLocation();
  const { todaySales, todayGrossProfit, totalUdhaarPending } = useFinance();
  const { lowStockCount } = useInventory();

  const navLinks = [
    { path: '/admin', label: 'Dashboard & Accounts', icon: LayoutDashboard },
    { path: '/admin/inventory', label: 'Item & Stock Inventory', icon: Package, badge: lowStockCount > 0 ? `${lowStockCount} Low` : null, badgeColor: '#ef4444' },
    { path: '/admin/pos', label: 'POS Counter Billing', icon: Calculator },
    { path: '/admin/khata', label: 'Customer Udhaar Khata', icon: BookOpen, badge: totalUdhaarPending > 0 ? `₹${totalUdhaarPending}` : null, badgeColor: '#ea580c' },
    { path: '/admin/expenses', label: 'Shop Expenses (Kharcha)', icon: Receipt }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      
      {/* Top Admin Bar */}
      <header style={{ backgroundColor: '#0f172a', color: 'white', padding: '12px 0', borderBottom: '1px solid #1e293b', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
          
          {/* Brand & Mode Tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <Store size={20} />
              </div>
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>
                  VK Kirana Store
                </div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#34d399', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Shop & Money Manager
                </div>
              </div>
            </Link>
          </div>

          {/* Quick Metrics Strip on Admin Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.82rem' }} className="hide-on-mobile">
            <div style={{ background: '#1e293b', padding: '5px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#94a3b8' }}>Today's Galla:</span>
              <strong style={{ color: '#34d399', fontSize: '0.95rem' }}>₹{todaySales.toLocaleString('en-IN')}</strong>
            </div>

            <div style={{ background: '#1e293b', padding: '5px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#94a3b8' }}>Pending Udhaar:</span>
              <strong style={{ color: '#fb923c', fontSize: '0.95rem' }}>₹{totalUdhaarPending.toLocaleString('en-IN')}</strong>
            </div>

            {lowStockCount > 0 && (
              <Link to="/admin/inventory" style={{ background: '#451a03', border: '1px solid #b45309', padding: '5px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', color: '#fde047' }}>
                <AlertTriangle size={14} />
                <span><strong>{lowStockCount}</strong> Items Low Stock</span>
              </Link>
            )}
          </div>

          {/* Actions: POS Quick Bill & Switch to Storefront */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link to="/admin/pos" className="btn btn-primary btn-sm">
              <Calculator size={15} />
              <span>POS Billing</span>
            </Link>

            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#cbd5e1',
                padding: '6px 12px',
                borderRadius: '8px',
                backgroundColor: '#1e293b',
                border: '1px solid #334155'
              }}
            >
              <Store size={15} />
              <span>View Online Store</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Admin Body: Sidebar + Content */}
      <div className="container" style={{ padding: '24px 1.25rem 60px', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px', alignItems: 'start' }} className="admin-grid-layout">
          
          {/* Left Admin Navigation Sidebar */}
          <aside className="card" style={{ padding: '12px', position: 'sticky', top: '80px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', padding: '8px 12px 6px', letterSpacing: '0.05em' }}>
              Store Management
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {navLinks.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      fontSize: '0.86rem',
                      fontWeight: 600,
                      backgroundColor: isActive ? '#ecfdf5' : 'transparent',
                      color: isActive ? '#065f46' : '#475569',
                      border: isActive ? '1px solid #a7f3d0' : '1px solid transparent',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Icon size={18} color={isActive ? '#10b981' : '#64748b'} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '6px',
                          backgroundColor: item.badgeColor ? `${item.badgeColor}20` : '#f1f5f9',
                          color: item.badgeColor || '#475569'
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '16px', paddingTop: '12px', padding: '12px' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>Logged in as:</div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>Shopkeeper / Owner</div>
              <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>Active Dukan Counter</div>
            </div>
          </aside>

          {/* Right Main Content */}
          <main>
            {/* Page Header */}
            {(title || actionButton) && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>{title}</h1>
                  {subtitle && <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>{subtitle}</p>}
                </div>
                {actionButton && <div>{actionButton}</div>}
              </div>
            )}

            {children}
          </main>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-grid-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
