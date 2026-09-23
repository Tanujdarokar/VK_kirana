import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  DollarSign,
  Package,
  BookOpen,
  Receipt,
  Calculator,
  Plus,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Banknote,
  QrCode,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { StatCard } from '../../components/admin/StatCard';
import { useFinance } from '../../context/FinanceContext';
import { useInventory } from '../../context/InventoryContext';

export const AdminDashboard = () => {
  const {
    todaySales,
    todayGrossProfit,
    todayExpenses,
    todayNetProfit,
    todayCashCollection,
    todayUpiCollection,
    todayUdhaarGiven,
    totalUdhaarPending,
    transactions
  } = useFinance();

  const { totalItems, lowStockCount, lowStockItems, totalValuationCost, totalValuationSell, potentialGrossProfit } = useInventory();

  return (
    <AdminLayout
      title="Kirana Business & Money Dashboard"
      subtitle="Track your daily counter sales, net profit margins, customer credit, and inventory stock"
      actionButton={
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/admin/pos" className="btn btn-primary btn-sm">
            <Calculator size={16} />
            <span>New Counter Bill (F2)</span>
          </Link>
          <Link to="/admin/inventory" className="btn btn-secondary btn-sm">
            <Plus size={16} />
            <span>Add Kirana Item</span>
          </Link>
        </div>
      }
    >
      {/* 1. Low Stock Alert Banner */}
      {lowStockCount > 0 && (
        <div
          style={{
            padding: '14px 18px',
            backgroundColor: '#fffbeb',
            border: '1.5px solid #fde68a',
            borderRadius: '12px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f59e0b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AlertTriangle size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#92400e' }}>
                {lowStockCount} Kirana items running low in the shop!
              </div>
              <div style={{ fontSize: '0.78rem', color: '#b45309' }}>
                {lowStockItems.slice(0, 3).map((it) => `${it.name} (${it.stock} left)`).join(', ')}
                {lowStockItems.length > 3 && ` and ${lowStockItems.length - 3} more`}
              </div>
            </div>
          </div>

          <Link to="/admin/inventory" className="btn btn-outline btn-sm" style={{ borderColor: '#d97706', color: '#92400e', backgroundColor: 'white' }}>
            Restock Inventory →
          </Link>
        </div>
      )}

      {/* 2. Key Money Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <StatCard
          title="Today's Sales (Galla)"
          value={todaySales}
          subtitle={`Cash: ₹${todayCashCollection} • UPI: ₹${todayUpiCollection}`}
          icon={DollarSign}
          color="#10b981"
        />

        <StatCard
          title="Today's Gross Profit"
          value={todayGrossProfit}
          subtitle="Margin before shop expenses"
          icon={TrendingUp}
          color="#3b82f6"
        />

        <StatCard
          title="Today's Net Profit"
          value={todayNetProfit}
          subtitle={`After ₹${todayExpenses} shop expenses`}
          icon={TrendingUp}
          color={todayNetProfit >= 0 ? '#10b981' : '#ef4444'}
        />

        <StatCard
          title="Customer Udhaar (Credit)"
          value={totalUdhaarPending}
          subtitle="Total pending customer dues"
          icon={BookOpen}
          color="#ea580c"
        />
      </div>

      {/* 3. Payment Mode Collection Split & Shop Valuation Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        
        {/* Payment Collection Split */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px', color: '#0f172a' }}>
            Today's Payment Collections
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Banknote size={20} color="#10b981" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Cash in Register</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Physical cash drawer collection</div>
                </div>
              </div>
              <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>₹{todayCashCollection}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <QrCode size={20} color="#3b82f6" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>UPI / QR Collections</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Google Pay, PhonePe, Paytm</div>
                </div>
              </div>
              <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>₹{todayUpiCollection}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BookOpen size={20} color="#ea580c" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Udhaar Given Today</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Added to Customer Khata ledger</div>
                </div>
              </div>
              <strong style={{ fontSize: '1.1rem', color: '#ea580c' }}>₹{todayUdhaarGiven}</strong>
            </div>
          </div>
        </div>

        {/* Total Inventory & Stock Valuation */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px', color: '#0f172a' }}>
            Store Inventory Stock Valuation
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Active Products</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{totalItems} items in shop</div>
              </div>
              <Package size={24} color="#64748b" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Inventory Purchase Value (Cost Price)</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#334155' }}>₹{totalValuationCost.toLocaleString('en-IN')}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Selling Retail Value</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>₹{totalValuationSell.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div style={{ padding: '10px 14px', backgroundColor: '#ecfdf5', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#065f46' }}>Potential Gross Margin on Stock:</span>
              <strong style={{ fontSize: '1.1rem', color: '#047857' }}>₹{potentialGrossProfit.toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recent Sales Transactions Ledger */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
              Recent Sales & Billing Transactions
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Walk-in counter POS bills and online storefront orders
            </p>
          </div>

          <Link to="/admin/pos" className="btn btn-primary btn-sm">
            <Calculator size={15} />
            <span>Open POS Counter</span>
          </Link>
        </div>

        {transactions.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
            No transactions recorded yet today. Click "New Counter Bill" to start billing.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '10px 14px', color: '#64748b' }}>Bill ID</th>
                  <th style={{ padding: '10px 14px', color: '#64748b' }}>Time</th>
                  <th style={{ padding: '10px 14px', color: '#64748b' }}>Customer</th>
                  <th style={{ padding: '10px 14px', color: '#64748b' }}>Items</th>
                  <th style={{ padding: '10px 14px', color: '#64748b' }}>Mode</th>
                  <th style={{ padding: '10px 14px', color: '#64748b' }}>Amount</th>
                  <th style={{ padding: '10px 14px', color: '#64748b' }}>Profit</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 8).map((txn) => (
                  <tr key={txn.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>#{txn.id}</td>
                    <td style={{ padding: '12px 14px', color: '#64748b' }}>
                      {new Date(txn.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#1e293b' }}>{txn.customerName}</td>
                    <td style={{ padding: '12px 14px', color: '#475569' }}>
                      {txn.items?.length} items ({txn.items?.map((i) => i.product.name).join(', ').slice(0, 24)}...)
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        backgroundColor:
                          txn.paymentMethod === 'cash' ? '#ecfdf5' :
                          txn.paymentMethod === 'upi' ? '#eff6ff' : '#fff7ed',
                        color:
                          txn.paymentMethod === 'cash' ? '#047857' :
                          txn.paymentMethod === 'upi' ? '#1d4ed8' : '#c2410c'
                      }}>
                        {txn.paymentMethod}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: '#0f172a' }}>₹{txn.subtotal}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#10b981' }}>+₹{txn.profit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
