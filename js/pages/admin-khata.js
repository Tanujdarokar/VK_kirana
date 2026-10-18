// Admin Khata Book Controller for admin-khata.html

import { initAdminLayout } from '../admin-common.js';
import { store } from '../store.js';

let activeCustomerId = null;
let khataSearch = '';

document.addEventListener('DOMContentLoaded', () => {
  initAdminLayout('khata');

  const customers = store.getKhataCustomers();
  if (customers.length > 0) {
    activeCustomerId = customers[0].id;
  }

  renderCustomerList();
  renderActiveCustomerLedger();
  setupKhataListeners();

  store.subscribe((event) => {
    if (event === 'khata_changed') {
      renderCustomerList();
      renderActiveCustomerLedger();
    }
  });
});

function renderCustomerList() {
  const container = document.getElementById('khata-customers-container');
  if (!container) return;

  const customers = store.getKhataCustomers();
  const q = khataSearch.toLowerCase().trim();

  const filtered = customers.filter(c => {
    if (q && !c.name.toLowerCase().includes(q) && !c.phone.includes(q)) return false;
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="padding: 20px; text-align: center; color: #94a3b8; font-size: 0.85rem;">No customers found.</div>`;
    return;
  }

  container.innerHTML = filtered.map(c => {
    const isActive = c.id === activeCustomerId;
    return `
      <div class="khata-customer-item ${isActive ? 'active' : ''}" onclick="window.khataSelectCustomer('${c.id}')">
        <div>
          <div style="font-weight: 800; font-size: 0.92rem; color: #0f172a;">${c.name}</div>
          <div style="font-size: 0.78rem; color: #64748b;">${c.phone}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: 900; font-size: 0.95rem; color: ${c.balance > 0 ? '#ef4444' : '#059669'};">
            ₹${c.balance}
          </div>
          <div style="font-size: 0.7rem; color: #94a3b8;">${c.balance > 0 ? 'Due' : 'Cleared'}</div>
        </div>
      </div>
    `;
  }).join('');
}

function renderActiveCustomerLedger() {
  const customers = store.getKhataCustomers();
  const cust = customers.find(c => c.id === activeCustomerId);
  if (!cust) return;

  document.getElementById('active-cust-name').textContent = cust.name;
  document.getElementById('active-cust-phone').textContent = `Phone: ${cust.phone}`;
  document.getElementById('active-cust-address').textContent = cust.address ? `Address: ${cust.address}` : 'Address: Main Market Area';

  const balanceEl = document.getElementById('active-cust-balance');
  balanceEl.textContent = `₹${cust.balance}`;
  balanceEl.style.color = cust.balance > 0 ? '#ef4444' : '#059669';

  // WhatsApp reminder button
  const waBtn = document.getElementById('active-cust-wa-btn');
  if (waBtn) {
    const msg = encodeURIComponent(`Namaste ${cust.name} ji, this is a reminder from VK Kirana & Supermarket. Your pending kirana udhar balance is ₹${cust.balance}. You can pay via UPI or cash on your next visit. Dhanyawad!`);
    waBtn.href = `https://wa.me/91${cust.phone}?text=${msg}`;
  }

  // Entries
  const entriesContainer = document.getElementById('active-cust-entries-list');
  if (entriesContainer) {
    if (!cust.entries || cust.entries.length === 0) {
      entriesContainer.innerHTML = `<div style="padding: 30px; text-align: center; color: #94a3b8; font-size: 0.88rem;">No transactions recorded for ${cust.name} yet.</div>`;
      return;
    }

    entriesContainer.innerHTML = cust.entries.map(e => {
      const isUdhar = e.type === 'udhaar';
      const dateStr = new Date(e.date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

      return `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="badge" style="background: ${isUdhar ? '#fee2e2' : '#ecfdf5'}; color: ${isUdhar ? '#dc2626' : '#059669'}; font-size: 0.7rem;">
                ${isUdhar ? '🔴 GAVE CREDIT' : '🟢 RECEIVED PAYMENT'}
              </span>
              <span style="font-size: 0.78rem; color: #64748b;">${dateStr}</span>
            </div>
            <div style="font-size: 0.88rem; font-weight: 700; color: #0f172a; margin-top: 4px;">
              ${e.note || (isUdhar ? 'Grocery Items' : 'Cash/UPI settlement')}
            </div>
          </div>

          <div style="font-size: 1.15rem; font-weight: 900; color: ${isUdhar ? '#ef4444' : '#059669'};">
            ${isUdhar ? '+' : '-'}₹${e.amount}
          </div>
        </div>
      `;
    }).join('');
  }
}

function setupKhataListeners() {
  const searchInput = document.getElementById('khata-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      khataSearch = e.target.value;
      renderCustomerList();
    });
  }

  // Modals
  const openCustModalBtn = document.getElementById('open-add-customer-modal-btn');
  const closeCustModalBtn = document.getElementById('close-cust-modal-btn');
  const custModal = document.getElementById('add-customer-modal');
  const custForm = document.getElementById('add-customer-form');

  if (openCustModalBtn && custModal) {
    openCustModalBtn.addEventListener('click', () => { custModal.style.display = 'flex'; });
  }
  if (closeCustModalBtn && custModal) {
    closeCustModalBtn.addEventListener('click', () => { custModal.style.display = 'none'; });
    custModal.addEventListener('click', (e) => {
      if (e.target === custModal) custModal.style.display = 'none';
    });
  }

  if (custForm) {
    custForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('khata-new-name').value.trim();
      const phone = document.getElementById('khata-new-phone').value.trim();
      const address = document.getElementById('khata-new-address').value.trim();

      const newCust = store.addKhataCustomer({ name, phone, address });
      activeCustomerId = newCust.id;
      custForm.reset();
      if (custModal) custModal.style.display = 'none';
    });
  }

  // Entry Modal (Diya vs Liya)
  const openDiyaBtn = document.getElementById('open-diya-btn');
  const openLiyaBtn = document.getElementById('open-liya-btn');
  const entryModal = document.getElementById('record-entry-modal');
  const closeEntryModalBtn = document.getElementById('close-entry-modal-btn');
  const entryForm = document.getElementById('record-entry-form');
  const entryTitle = document.getElementById('record-entry-title');
  const entryTypeInput = document.getElementById('record-entry-type');
  const entrySubmitBtn = document.getElementById('record-entry-submit-btn');

  if (openDiyaBtn) {
    openDiyaBtn.addEventListener('click', () => {
      entryTitle.textContent = 'Record Credit Given (Udhaar Diya)';
      entryTitle.style.color = '#dc2626';
      entryTypeInput.value = 'udhaar';
      entrySubmitBtn.textContent = 'Save Udhaar Entry';
      entrySubmitBtn.className = 'btn btn-danger';
      entryModal.style.display = 'flex';
    });
  }

  if (openLiyaBtn) {
    openLiyaBtn.addEventListener('click', () => {
      entryTitle.textContent = 'Record Payment Received (Jama Liya)';
      entryTitle.style.color = '#059669';
      entryTypeInput.value = 'jama';
      entrySubmitBtn.textContent = 'Save Jama Payment';
      entrySubmitBtn.className = 'btn btn-primary';
      entryModal.style.display = 'flex';
    });
  }

  if (closeEntryModalBtn && entryModal) {
    closeEntryModalBtn.addEventListener('click', () => { entryModal.style.display = 'none'; });
    entryModal.addEventListener('click', (e) => {
      if (e.target === entryModal) entryModal.style.display = 'none';
    });
  }

  if (entryForm) {
    entryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!activeCustomerId) return;

      const type = entryTypeInput.value;
      const amount = Number(document.getElementById('record-entry-amount').value);
      const note = document.getElementById('record-entry-note').value.trim();

      store.addKhataEntry(activeCustomerId, { type, amount, note });
      entryForm.reset();
      if (entryModal) entryModal.style.display = 'none';
    });
  }
}

window.khataSelectCustomer = (id) => {
  activeCustomerId = id;
  renderCustomerList();
  renderActiveCustomerLedger();
};
