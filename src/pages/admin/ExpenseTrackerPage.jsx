import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Trash2,
  Calendar,
  X,
  DollarSign,
  TrendingDown,
  Tag,
  Truck,
  Zap,
  Coffee,
  ShoppingBag
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useFinance } from '../../context/FinanceContext';
import { useToast } from '../../context/ToastContext';

const EXPENSE_CATEGORIES = [
  { id: 'transport', label: 'Mandi Transport / Tempo', icon: Truck, color: '#3b82f6' },
  { id: 'bags', label: 'Carry Bags & Packaging', icon: ShoppingBag, color: '#10b981' },
  { id: 'electricity', label: 'Electricity & Shop Bills', icon: Zap, color: '#f59e0b' },
  { id: 'tea_snacks', label: 'Tea & Staff Snacks', icon: Coffee, color: '#ea580c' },
  { id: 'salary', label: 'Helper / Staff Daily Wages', icon: DollarSign, color: '#8b5cf6' },
  { id: 'rent', label: 'Shop Rent', icon: Receipt, color: '#ec4899' },
  { id: 'misc', label: 'Other Miscellaneous Kharcha', icon: Tag, color: '#64748b' }
];

export const ExpenseTrackerPage = () => {
  const { expenses, addExpense, deleteExpense, todayExpenses, totalExpensesAllTime } = useFinance();
  const { showError } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: 'transport',
    amount: '',
    note: '',
    paidVia: 'cash'
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || Number(formData.amount) <= 0) {
      showError('Please enter a valid expense amount.');
      return;
    }
    addExpense(formData);
    setIsModalOpen(false);
    setFormData({ category: 'transport', amount: '', note: '', paidVia: 'cash' });
  };

  return (
    <AdminLayout
      title="Shop Expenses & Kharcha Tracker"
      subtitle="Record daily shop operational expenses to calculate real net business profit"
      actionButton={
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>Add Shop Expense</span>
        </button>
      }
    >
      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{ padding: '20px', borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
            Today's Total Kharcha
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#dc2626' }}>
            ₹{todayExpenses}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
            Deducted from today's profit
          </div>
        </div>

        <div className="card" style={{ padding: '20px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
            Total Recorded Expenses
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#d97706' }}>
            ₹{totalExpensesAllTime}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
            Across {expenses.length} entries
          </div>
        </div>
      </div>

      {/* Expenses Ledger Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
            Daily Expense Ledger ({expenses.length})
          </h3>
        </div>

        {expenses.length === 0 ? (
          <div style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
            No shop expenses recorded. Click "Add Shop Expense" to log daily kharcha.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px', color: '#64748b' }}>Date & Time</th>
                  <th style={{ padding: '12px 16px', color: '#64748b' }}>Expense Category</th>
                  <th style={{ padding: '12px 16px', color: '#64748b' }}>Note / Details</th>
                  <th style={{ padding: '12px 16px', color: '#64748b' }}>Paid Via</th>
                  <th style={{ padding: '12px 16px', color: '#64748b', textAlign: 'right' }}>Amount</th>
                  <th style={{ padding: '12px 16px', color: '#64748b', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => {
                  const cat = EXPENSE_CATEGORIES.find((c) => c.id === exp.category) || EXPENSE_CATEGORIES[6];
                  const Icon = cat.icon;

                  return (
                    <tr key={exp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.82rem' }}>
                        {new Date(exp.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })},{' '}
                        {new Date(exp.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#1e293b' }}>
                          <Icon size={16} color={cat.color} />
                          <span>{cat.label}</span>
                        </div>
                      </td>

                      <td style={{ padding: '12px 16px', color: '#475569' }}>
                        {exp.note || '-'}
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: '#f1f5f9', textTransform: 'uppercase' }}>
                          {exp.paidVia}
                        </span>
                      </td>

                      <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 800, color: '#dc2626', fontSize: '0.95rem' }}>
                        -₹{exp.amount}
                      </td>

                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <button
                          onClick={() => deleteExpense(exp.id)}
                          className="btn-icon"
                          style={{ width: '28px', height: '28px', color: '#ef4444' }}
                          title="Delete Expense"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" style={{ maxWidth: '440px', padding: '24px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Record Shop Expense (Kharcha)</h3>
              <button onClick={() => setIsModalOpen(false)} className="btn-icon"><X size={18} /></button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Expense Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.88rem' }}
                >
                  {EXPENSE_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Expense Amount ₹ *
                </label>
                <input
                  type="number"
                  placeholder="e.g. 150"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  autoFocus
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 800 }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Description / Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tempo fare from Mandi, carry bags pack of 100"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Paid Mode
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="paidVia"
                      checked={formData.paidVia === 'cash'}
                      onChange={() => setFormData({ ...formData, paidVia: 'cash' })}
                    />
                    <span>Shop Cash Counter</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="paidVia"
                      checked={formData.paidVia === 'upi'}
                      onChange={() => setFormData({ ...formData, paidVia: 'upi' })}
                    />
                    <span>UPI / Bank Transfer</span>
                  </label>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
                Save Expense Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
