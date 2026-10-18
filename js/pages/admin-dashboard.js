// Admin Dashboard Controller for admin.html

import { initAdminLayout } from '../admin-common.js';
import { store } from '../store.js';

document.addEventListener('DOMContentLoaded', () => {
  initAdminLayout('dashboard');
  renderDashboardData();

  store.subscribe(() => {
    renderDashboardData();
  });
});

function renderDashboardData() {
  const products = store.getProducts();
  const transactions = store.getTransactions();
  const khata = store.getKhataCustomers();

  // Metrics
  const totalSales = transactions.reduce((sum, t) => sum + (t.subtotal || 0), 0);
  const totalUdhaar = khata.reduce((sum, c) => sum + (c.balance || 0), 0);
  const lowStockItems = products.filter(p => p.stock <= (p.minStockAlert || 5));

  document.getElementById('stat-sales').textContent = `₹${totalSales}`;
  document.getElementById('stat-khata').textContent = `₹${totalUdhaar}`;
  document.getElementById('stat-low-stock').textContent = lowStockItems.length;
  document.getElementById('stat-total-items').textContent = products.length;

  // Recent Sales List
  const salesList = document.getElementById('recent-sales-list');
  if (salesList) {
    if (transactions.length === 0) {
      salesList.innerHTML = `<div style="padding: 20px; text-align: center; color: #64748b; font-size: 0.9rem;">No POS sales recorded today.</div>`;
    } else {
      salesList.innerHTML = transactions.slice(0, 5).map(t => {
        const timeStr = new Date(t.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0;">
            <div>
              <div style="font-weight: 800; font-size: 0.88rem; color: #0f172a;">${t.id} • ${t.customerName}</div>
              <div style="font-size: 0.75rem; color: #64748b;">${timeStr} • Paid via ${t.paymentMethod.toUpperCase()}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: 900; font-size: 0.95rem; color: #047857;">₹${t.subtotal}</div>
              <div style="font-size: 0.72rem; color: #047857; font-weight: 700;">+₹${t.profit || 0} profit</div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Low Stock Items List
  const stockList = document.getElementById('low-stock-list');
  if (stockList) {
    if (lowStockItems.length === 0) {
      stockList.innerHTML = `<div style="padding: 20px; text-align: center; color: #047857; font-size: 0.9rem;">✓ All grocery items have adequate stock!</div>`;
    } else {
      stockList.innerHTML = lowStockItems.slice(0, 5).map(p => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: #fffbeb; border-radius: 10px; border: 1px solid #fde68a;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="${p.image}" alt="${p.name}" loading="lazy" decoding="async" width="34" height="34" style="width: 34px; height: 34px; object-fit: cover; border-radius: 6px;" />
            <div>
              <div style="font-weight: 700; font-size: 0.85rem; color: #0f172a;">${p.name}</div>
              <div style="font-size: 0.75rem; color: #b45309;">${p.unit}</div>
            </div>
          </div>
          <span class="badge" style="background: #fee2e2; color: #dc2626; font-weight: 800;">
            Only ${p.stock} left
          </span>
        </div>
      `).join('');
    }
  }
}
