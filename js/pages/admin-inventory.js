// Admin Inventory Controller for admin-inventory.html

import { initAdminLayout } from '../admin-common.js';
import { store } from '../store.js';

let invSearch = '';
let lowStockOnly = false;

document.addEventListener('DOMContentLoaded', () => {
  initAdminLayout('inventory');
  renderInventory();
  renderCustomerRequests();
  setupInventoryListeners();

  store.subscribe((event) => {
    if (event === 'inventory_changed') {
      renderInventory();
    }
  });
});

function renderInventory() {
  const products = store.getProducts();
  const q = invSearch.toLowerCase().trim();

  const lowStockCount = products.filter(p => p.stock <= (p.minStockAlert || 5)).length;
  document.getElementById('inv-low-count').textContent = lowStockCount;
  document.getElementById('inv-total-count').textContent = products.length;

  const filtered = products.filter(p => {
    if (lowStockOnly && p.stock > (p.minStockAlert || 5)) return false;
    if (q) {
      const match = [p.name, p.brand, p.categoryName].join(' ').toLowerCase();
      if (!match.includes(q)) return false;
    }
    return true;
  });

  const tbody = document.getElementById('inventory-table-body');
  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="padding: 30px; text-align: center; color: #64748b;">No items match the search query.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(p => {
    const sellPrice = p.discountPrice || p.price;
    const costPrice = p.costPrice || Math.round(sellPrice * 0.82);
    const profit = Math.max(0, sellPrice - costPrice);
    const marginPct = Math.round((profit / sellPrice) * 100);

    let statusBadge = `<span class="badge badge-fresh">In Stock</span>`;
    if (p.stock === 0) {
      statusBadge = `<span class="badge" style="background:#fee2e2;color:#dc2626;">Out of Stock</span>`;
    } else if (p.stock <= (p.minStockAlert || 5)) {
      statusBadge = `<span class="badge badge-deal">Low Stock (${p.stock})</span>`;
    }

    return `
      <tr style="border-bottom: 1px solid #f1f5f9; transition: background 0.2s;" onmouseover="this.style.backgroundColor='#f8fafc'" onmouseout="this.style.backgroundColor='transparent'">
        <td style="padding: 12px 18px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="${p.image}" alt="${p.name}" loading="lazy" decoding="async" width="40" height="40" style="width: 40px; height: 40px; object-fit: cover; border-radius: 8px; background: #f8fafc;" />
            <div>
              <div style="font-weight: 800; color: #0f172a; max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</div>
              <div style="font-size: 0.75rem; color: #64748b;">${p.brand || 'Kirana'} • ${p.unit}</div>
            </div>
          </div>
        </td>
        <td style="padding: 12px; color: #475569; font-size: 0.82rem;">${p.categoryName || p.category}</td>
        <td style="padding: 12px; font-weight: 900; color: #0f172a;">₹${sellPrice}</td>
        <td style="padding: 12px; color: #64748b;">₹${costPrice}</td>
        <td style="padding: 12px; font-weight: 800; color: #047857;">${marginPct}% (₹${profit})</td>
        <td style="padding: 12px;">
          <div style="display: inline-flex; align-items: center; border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden; background: white;">
            <button style="width: 26px; height: 26px; font-weight: 800; font-size: 0.85rem;" onclick="window.invUpdateStock('${p.id}', ${Math.max(0, p.stock - 5)})">-5</button>
            <span style="width: 36px; text-align: center; font-weight: 800; font-size: 0.85rem; color: #0f172a;">${p.stock}</span>
            <button style="width: 26px; height: 26px; font-weight: 800; font-size: 0.85rem;" onclick="window.invUpdateStock('${p.id}', ${p.stock + 10})">+10</button>
          </div>
        </td>
        <td style="padding: 12px;">${statusBadge}</td>
        <td style="padding: 12px 18px; text-align: right;">
          <button class="btn btn-outline btn-sm" style="color: #ef4444; border-color: #fee2e2; padding: 4px 8px;" onclick="window.invDeleteItem('${p.id}')">
            Delete
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderCustomerRequests() {
  const container = document.getElementById('customer-requests-list');
  if (!container) return;

  const requests = store.getRequestedItems();
  if (requests.length === 0) {
    container.innerHTML = `<div style="padding: 20px; text-align: center; color: #64748b; font-size: 0.88rem;">No unlisted item requests currently.</div>`;
    return;
  }

  container.innerHTML = requests.map(r => `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 10px;">
      <div>
        <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem;">${r.name} (${r.qty})</div>
        <div style="font-size: 0.78rem; color: #64748b;">
          Requested by <strong>${r.customerName}</strong> (${r.customerPhone}) ${r.note ? `• Note: "${r.note}"` : ''}
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <span class="badge badge-deal">${r.status || 'Pending'}</span>
        <a href="https://wa.me/?text=Hello%20${encodeURIComponent(r.customerName)},%20we%20have%20arranged%20your%20requested%20item%20at%20VK%20Kirana!" target="_blank" class="btn btn-outline btn-sm" style="color: #047857; border-color: #a7f3d0;">
          WhatsApp Buyer
        </a>
      </div>
    </div>
  `).join('');
}

function setupInventoryListeners() {
  const searchInput = document.getElementById('inv-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      invSearch = e.target.value;
      renderInventory();
    });
  }

  const lowStockCb = document.getElementById('inv-low-stock-only');
  if (lowStockCb) {
    lowStockCb.addEventListener('change', (e) => {
      lowStockOnly = e.target.checked;
      renderInventory();
    });
  }

  // Add Product Modal
  const openModalBtn = document.getElementById('open-add-product-modal-btn');
  const closeModalBtn = document.getElementById('close-add-modal-btn');
  const modal = document.getElementById('add-product-modal');
  const form = document.getElementById('add-product-form');

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
      const name = document.getElementById('add-p-name').value.trim();
      const category = document.getElementById('add-p-category').value;
      const brand = document.getElementById('add-p-brand').value.trim() || 'VK Kirana';
      const price = Number(document.getElementById('add-p-price').value);
      const costPrice = Number(document.getElementById('add-p-cost').value || Math.round(price * 0.8));
      const unit = document.getElementById('add-p-unit').value.trim() || '1 unit';
      const stock = Number(document.getElementById('add-p-stock').value || 25);
      const image = document.getElementById('add-p-image').value.trim();

      const product = store.addProduct({
        name,
        category,
        brand,
        price,
        costPrice,
        unit,
        stock,
        image
      });
      if (!product) return;

      form.reset();
      if (modal) modal.style.display = 'none';
    });
  }
}

window.invUpdateStock = (id, newStock) => {
  store.updateStock(id, newStock);
};

window.invDeleteItem = (id) => {
  if (confirm('Are you sure you want to delete this product from the inventory?')) {
    store.deleteProduct(id);
  }
};
