// Admin POS Billing Controller for admin-pos.html

import { initAdminLayout } from '../admin-common.js';
import { store } from '../store.js';
import { categories } from '../data/categories.js';

let activePosCategory = 'all';
let posSearchQuery = '';
let billItems = [];
let currentBillId = 'TXN-' + Math.floor(100 + Math.random() * 900);

document.addEventListener('DOMContentLoaded', () => {
  initAdminLayout('pos');
  document.getElementById('pos-bill-id').textContent = currentBillId;

  renderCategoryPills();
  renderPosCatalog();
  renderBillCart();
  setupPosListeners();
});

function renderCategoryPills() {
  const container = document.getElementById('pos-cat-pills');
  if (!container) return;

  container.innerHTML = `
    <button class="btn btn-sm ${activePosCategory === 'all' ? 'btn-primary' : 'btn-outline'}" data-cat="all" style="padding: 4px 10px; font-size: 0.78rem;">
      All Items
    </button>
    ${categories.map(c => `
      <button class="btn btn-sm ${activePosCategory === c.slug ? 'btn-primary' : 'btn-outline'}" data-cat="${c.slug}" style="padding: 4px 10px; font-size: 0.78rem;">
        ${c.name}
      </button>
    `).join('')}
  `;

  container.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      activePosCategory = btn.getAttribute('data-cat');
      renderCategoryPills();
      renderPosCatalog();
    });
  });
}

function renderPosCatalog() {
  const container = document.getElementById('pos-products-grid');
  if (!container) return;

  const products = store.getProducts();
  const q = posSearchQuery.toLowerCase().trim();

  const filtered = products.filter(p => {
    if (activePosCategory !== 'all' && p.category !== activePosCategory) return false;
    if (q) {
      const match = [p.name, p.brand, p.categoryName].join(' ').toLowerCase();
      if (!match.includes(q)) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; padding: 20px; text-align: center; color: #94a3b8;">No items match "${posSearchQuery}"</div>`;
    return;
  }

  container.innerHTML = filtered.map(p => {
    const price = p.discountPrice || p.price;
    return `
      <div class="pos-product-item" onclick="window.posAddToCart('${p.id}')">
        <img src="${p.image}" alt="${p.name}" style="width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 8px; margin-bottom: 6px;" />
        <div style="font-size: 0.75rem; font-weight: 700; color: #0f172a; line-height: 1.2; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 2.4em;">
          ${p.name}
        </div>
        <div style="display: flex; align-items: baseline; justify-content: space-between; margin-top: auto; padding-top: 6px;">
          <span style="font-weight: 900; color: #059669; font-size: 0.95rem;">₹${price}</span>
          <span style="font-size: 0.7rem; color: #64748b;">${p.unit}</span>
        </div>
      </div>
    `;
  }).join('');
}

function renderBillCart() {
  const container = document.getElementById('pos-bill-items-list');
  const totalEl = document.getElementById('pos-bill-total');
  if (!container) return;

  if (billItems.length === 0) {
    container.innerHTML = `<div style="padding: 40px 10px; text-align: center; color: #94a3b8; font-size: 0.85rem;">Click any product or scan to add to bill.</div>`;
    if (totalEl) totalEl.textContent = '₹0';
    updateChange();
    return;
  }

  const grandTotal = billItems.reduce((sum, item) => {
    const price = item.product.discountPrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  if (totalEl) totalEl.textContent = `₹${grandTotal}`;

  container.innerHTML = billItems.map(item => {
    const p = item.product;
    const price = p.discountPrice || p.price;
    const total = price * item.quantity;

    return `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f1f5f9; font-size: 0.85rem;">
        <div style="flex: 1; min-width: 0; padding-right: 8px;">
          <div style="font-weight: 700; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</div>
          <div style="font-size: 0.72rem; color: #64748b;">₹${price} × ${item.quantity} • ${p.unit}</div>
        </div>

        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="display: flex; align-items: center; border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden;">
            <button style="width: 22px; height: 22px; font-weight: 800; font-size: 0.85rem;" onclick="window.posChangeQty('${p.id}', -1)">-</button>
            <span style="width: 20px; text-align: center; font-size: 0.78rem; font-weight: 700;">${item.quantity}</span>
            <button style="width: 22px; height: 22px; font-weight: 800; font-size: 0.85rem;" onclick="window.posChangeQty('${p.id}', 1)">+</button>
          </div>

          <span style="font-weight: 800; color: #0f172a; min-width: 44px; text-align: right;">₹${total}</span>
          <button style="border: none; background: none; color: #ef4444; cursor: pointer; font-size: 0.9rem;" onclick="window.posRemoveItem('${p.id}')">✕</button>
        </div>
      </div>
    `;
  }).join('');

  updateChange();
}

function updateChange() {
  const totalEl = document.getElementById('pos-bill-total');
  const cashInput = document.getElementById('pos-cash-received');
  const changeEl = document.getElementById('pos-change-returned');

  const total = parseInt((totalEl?.textContent || '0').replace('₹', '')) || 0;
  const cash = parseInt(cashInput?.value || '0') || 0;

  if (cash >= total && total > 0) {
    if (changeEl) changeEl.textContent = `₹${cash - total}`;
  } else {
    if (changeEl) changeEl.textContent = '₹0';
  }
}

function setupPosListeners() {
  const searchInput = document.getElementById('pos-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      posSearchQuery = e.target.value;
      renderPosCatalog();
    });
  }

  const barcodeBtn = document.getElementById('pos-barcode-sim-btn');
  if (barcodeBtn) {
    barcodeBtn.addEventListener('click', () => {
      const products = store.getProducts();
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      window.posAddToCart(randomProduct.id);
      store.showToast(`Scanned Barcode: ${randomProduct.name}`);
    });
  }

  const clearBtn = document.getElementById('pos-clear-bill-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      billItems = [];
      currentBillId = 'TXN-' + Math.floor(100 + Math.random() * 900);
      document.getElementById('pos-bill-id').textContent = currentBillId;
      renderBillCart();
    });
  }

  const cashInput = document.getElementById('pos-cash-received');
  if (cashInput) {
    cashInput.addEventListener('input', updateChange);
  }

  // Payment radio styling
  document.querySelectorAll('input[name="pos-pay-mode"]').forEach(radio => {
    radio.parentElement.addEventListener('click', () => {
      document.querySelectorAll('input[name="pos-pay-mode"]').forEach(r => {
        r.parentElement.style.borderColor = '#cbd5e1';
        r.parentElement.style.backgroundColor = 'transparent';
      });
      radio.checked = true;
      radio.parentElement.style.borderColor = '#059669';
      radio.parentElement.style.backgroundColor = '#ecfdf5';
    });
  });

  // Complete Sale
  const completeBtn = document.getElementById('pos-complete-sale-btn');
  if (completeBtn) {
    completeBtn.addEventListener('click', () => {
      if (billItems.length === 0) {
        store.showToast('Please add products to the counter bill first!', 'error');
        return;
      }

      const customerName = document.getElementById('pos-cust-name').value.trim() || 'Walk-in Customer';
      const phone = document.getElementById('pos-cust-phone').value.trim();
      const payModeEl = document.querySelector('input[name="pos-pay-mode"]:checked');
      const paymentMethod = payModeEl ? payModeEl.value : 'cash';

      const subtotal = billItems.reduce((sum, i) => sum + (i.product.discountPrice || i.product.price) * i.quantity, 0);
      const cost = billItems.reduce((sum, i) => sum + (i.product.costPrice || 0) * i.quantity, 0);
      const profit = Math.max(0, subtotal - cost);

      const cashReceived = parseInt(document.getElementById('pos-cash-received').value || '0') || subtotal;
      const changeReturned = Math.max(0, cashReceived - subtotal);

      // Record transaction
      const txn = store.recordPosSale({
        customerName,
        items: billItems,
        subtotal,
        cost,
        profit,
        paymentMethod,
        amountPaid: cashReceived,
        changeReturned
      });

      // If Khata chosen and customer exists, record udhar
      if (paymentMethod === 'khata' && phone) {
        const khataList = store.getKhataCustomers();
        let cust = khataList.find(c => c.phone === phone);
        if (!cust) {
          cust = store.addKhataCustomer({ name: customerName, phone });
        }
        store.addKhataEntry(cust.id, {
          type: 'udhaar',
          amount: subtotal,
          note: `POS Counter Bill #${txn.id}`
        });
      }

      // Show Receipt Modal
      showReceiptModal(txn, billItems, subtotal, paymentMethod);

      // Reset
      billItems = [];
      document.getElementById('pos-cust-name').value = '';
      document.getElementById('pos-cust-phone').value = '';
      document.getElementById('pos-cash-received').value = '';
      currentBillId = 'TXN-' + Math.floor(100 + Math.random() * 900);
      document.getElementById('pos-bill-id').textContent = currentBillId;
      renderBillCart();
    });
  }

  // Receipt Modal actions
  const closeReceiptBtn = document.getElementById('pos-close-receipt-btn');
  const printReceiptBtn = document.getElementById('pos-print-now-btn');
  const modal = document.getElementById('pos-receipt-modal');

  if (closeReceiptBtn && modal) {
    closeReceiptBtn.addEventListener('click', () => { modal.style.display = 'none'; });
  }
  if (printReceiptBtn) {
    printReceiptBtn.addEventListener('click', () => { window.print(); });
  }
}

function showReceiptModal(txn, items, subtotal, paymentMethod) {
  const modal = document.getElementById('pos-receipt-modal');
  if (!modal) return;

  document.getElementById('receipt-date-time').textContent = new Date().toLocaleString();
  document.getElementById('receipt-grand-total').textContent = `₹${subtotal}`;
  document.getElementById('receipt-pay-mode').textContent = paymentMethod.toUpperCase();

  const table = document.getElementById('receipt-items-table');
  table.innerHTML = items.map(item => {
    const p = item.product;
    const price = p.discountPrice || p.price;
    return `
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span>${item.quantity}x ${p.name.slice(0, 20)}</span>
        <span>₹${price * item.quantity}</span>
      </div>
    `;
  }).join('');

  modal.style.display = 'flex';
}

window.posAddToCart = (id) => {
  const p = store.getProductById(id);
  if (!p) return;
  const existing = billItems.find(i => i.product.id === id);
  if (existing) {
    existing.quantity++;
  } else {
    billItems.push({ product: p, quantity: 1 });
  }
  renderBillCart();
};

window.posChangeQty = (id, delta) => {
  const existing = billItems.find(i => i.product.id === id);
  if (existing) {
    existing.quantity += delta;
    if (existing.quantity <= 0) {
      billItems = billItems.filter(i => i.product.id !== id);
    }
  }
  renderBillCart();
};

window.posRemoveItem = (id) => {
  billItems = billItems.filter(i => i.product.id !== id);
  renderBillCart();
};
