// Admin Expenses Controller for admin-expenses.html

import { initAdminLayout } from '../admin-common.js';
import { store } from '../store.js';

document.addEventListener('DOMContentLoaded', () => {
  initAdminLayout('expenses');
  renderExpenses();
  setupExpenseListeners();

  store.subscribe((event) => {
    if (event === 'expenses_changed') {
      renderExpenses();
    }
  });
});

function renderExpenses() {
  const expenses = store.getExpenses();

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const transport = expenses.filter(e => e.category === 'transport').reduce((sum, e) => sum + e.amount, 0);
  const bags = expenses.filter(e => e.category === 'bags').reduce((sum, e) => sum + e.amount, 0);
  const snacks = expenses.filter(e => e.category === 'tea_snacks').reduce((sum, e) => sum + e.amount, 0);

  document.getElementById('stat-total-expenses').textContent = `₹${total}`;
  document.getElementById('stat-transport-expenses').textContent = `₹${transport}`;
  document.getElementById('stat-bags-expenses').textContent = `₹${bags}`;
  document.getElementById('stat-snacks-expenses').textContent = `₹${snacks}`;

  const tbody = document.getElementById('expenses-table-body');
  if (!tbody) return;

  if (expenses.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="padding: 30px; text-align: center; color: #94a3b8;">No expenses recorded yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = expenses.map(e => {
    const dateStr = new Date(e.date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const categoryNames = {
      transport: 'Tempo / Transport',
      bags: 'Carry Bags & Packaging',
      tea_snacks: 'Helper Chai & Snacks',
      wages: 'Helper Wages',
      electricity: 'Electricity Bill',
      rent: 'Shop Rent',
      other: 'Other'
    };

    return `
      <tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.2s;" onmouseover="this.style.backgroundColor='#f8fafc'" onmouseout="this.style.backgroundColor='transparent'">
        <td style="padding: 12px 20px; font-weight: 700; color: #0f172a;">
          ${categoryNames[e.category] || e.category}
        </td>
        <td style="padding: 12px; font-weight: 900; color: #ef4444;">₹${e.amount}</td>
        <td style="padding: 12px; color: #475569;">${e.note || '-'}</td>
        <td style="padding: 12px; color: #64748b; font-size: 0.8rem;">${dateStr}</td>
        <td style="padding: 12px;">
          <span class="badge" style="background: #f1f5f9; color: #334155;">
            ${(e.paidVia || 'cash').toUpperCase()}
          </span>
        </td>
        <td style="padding: 12px 20px; text-align: right;">
          <button class="btn btn-outline btn-sm" style="color: #ef4444; border-color: #fee2e2; padding: 4px 8px;" onclick="window.expDelete('${e.id}')">
            Delete
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function setupExpenseListeners() {
  const openModalBtn = document.getElementById('open-add-expense-modal-btn');
  const closeModalBtn = document.getElementById('close-exp-modal-btn');
  const modal = document.getElementById('add-expense-modal');
  const form = document.getElementById('add-expense-form');

  if (openModalBtn && modal) {
    openModalBtn.addEventListener('click', () => { modal.style.display = 'flex'; });
  }

  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const category = document.getElementById('exp-category').value;
      const amount = Number(document.getElementById('exp-amount').value);
      const note = document.getElementById('exp-note').value.trim();
      const paidVia = document.getElementById('exp-paid-via').value;

      store.addExpense({ category, amount, note, paidVia });
      form.reset();
      if (modal) modal.style.display = 'none';
    });
  }
}

window.expDelete = (id) => {
  if (confirm('Are you sure you want to delete this expense record?')) {
    store.deleteExpense(id);
  }
};
