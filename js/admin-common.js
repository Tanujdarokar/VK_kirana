// VKCommerce Admin Shared Layout, Sidebar, Topbar & Vendor Guard

import { store } from './store.js';

export function initAdminLayout(activePage = 'dashboard') {
  renderAdminNav(activePage);
  checkVendorGuard();

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function checkVendorGuard() {
  const user = store.getUser();
  const isVendor = user && user.role === 'vendor';

  if (!isVendor) {
    const guardOverlay = document.createElement('div');
    guardOverlay.id = 'admin-guard-overlay';
    guardOverlay.className = 'modal-backdrop';
    guardOverlay.style.zIndex = '9999';
    guardOverlay.innerHTML = `
      <div class="modal-card" style="max-width: 500px; padding: 32px; text-align: center;">
        <div style="width: 60px; height: 60px; border-radius: 50%; background: #fee2e2; color: #ef4444; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 1.8rem;">
          🛡️
        </div>
        <span style="font-size: 0.75rem; font-weight: 800; color: #dc2626; background: #fee2e2; padding: 3px 10px; border-radius: 20px; text-transform: uppercase;">
          Store Owner Only
        </span>
        <h2 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin: 12px 0 8px;">
          Kirana Owner / Dukan Access
        </h2>
        <p style="color: #64748b; font-size: 0.9rem; line-height: 1.5; margin-bottom: 24px;">
          You are currently viewing as ${user ? `<strong>${user.name}</strong> (Customer)` : 'Guest'}.
          POS billing, Khata book, inventory stock, and expenses management are reserved for the shopkeeper.
        </p>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <button id="guard-switch-vendor-btn" class="btn btn-primary" style="background: #0f172a; border-color: #1e293b; padding: 12px;">
            🏪 Switch to Store Owner Demo (Vijay Dukan)
          </button>
          <a href="index.html" class="btn btn-outline" style="padding: 10px;">
            ← Return to Customer Storefront
          </a>
        </div>
      </div>
    `;
    document.body.appendChild(guardOverlay);

    document.getElementById('guard-switch-vendor-btn').addEventListener('click', () => {
      store.loginAsVendor();
      guardOverlay.remove();
      window.location.reload();
    });
  }
}

function renderAdminNav(activePage) {
  const sidebarContainer = document.getElementById('admin-sidebar-container');
  const topbarContainer = document.getElementById('admin-topbar-container');

  const user = store.getUser();

  if (sidebarContainer) {
    sidebarContainer.innerHTML = `
      <div class="admin-sidebar" id="admin-sidebar">
        <div class="admin-sidebar-header">
          <a href="admin.html" style="display: flex; align-items: center; gap: 10px; text-decoration: none;">
            <div style="width: 36px; height: 36px; border-radius: 10px; background: #059669; display: flex; align-items: center; justify-content: center; color: white;">
              <i data-lucide="store" style="width: 20px; height: 20px;"></i>
            </div>
            <div>
              <div style="font-size: 1.1rem; font-weight: 800; color: white;">VK Kirana</div>
              <div style="font-size: 0.65rem; color: #34d399; font-weight: 700;">DUKAN MANAGEMENT</div>
            </div>
          </a>
        </div>

        <nav class="admin-nav">
          <a href="admin.html" class="admin-nav-item ${activePage === 'dashboard' ? 'active' : ''}">
            <i data-lucide="layout-dashboard" style="width: 18px; height: 18px;"></i>
            <span>Overview Dashboard</span>
          </a>

          <a href="admin-pos.html" class="admin-nav-item ${activePage === 'pos' ? 'active' : ''}">
            <i data-lucide="calculator" style="width: 18px; height: 18px;"></i>
            <span>Counter POS Billing</span>
          </a>

          <a href="admin-inventory.html" class="admin-nav-item ${activePage === 'inventory' ? 'active' : ''}">
            <i data-lucide="boxes" style="width: 18px; height: 18px;"></i>
            <span>Inventory & Stock</span>
          </a>

          <a href="admin-khata.html" class="admin-nav-item ${activePage === 'khata' ? 'active' : ''}">
            <i data-lucide="book-open" style="width: 18px; height: 18px;"></i>
            <span>Khata Book (Udhaar)</span>
          </a>

          <a href="admin-expenses.html" class="admin-nav-item ${activePage === 'expenses' ? 'active' : ''}">
            <i data-lucide="receipt" style="width: 18px; height: 18px;"></i>
            <span>Shop Expense Tracker</span>
          </a>

          <div style="border-top: 1px solid #1e293b; margin: 12px 0; padding-top: 12px;"></div>

          <a href="index.html" class="admin-nav-item" style="color: #38bdf8;">
            <i data-lucide="shopping-cart" style="width: 18px; height: 18px;"></i>
            <span>Customer Storefront</span>
          </a>
        </nav>

        <div class="admin-sidebar-footer">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: #059669; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem;">
              ${user ? user.name.charAt(0) : 'V'}
            </div>
            <div style="min-width: 0; flex: 1;">
              <div style="font-size: 0.85rem; font-weight: 700; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${user ? user.name : 'Vijay Owner'}
              </div>
              <div style="font-size: 0.7rem; color: #94a3b8;">Dukan Manager</div>
            </div>
          </div>

          <button id="admin-logout-btn" class="btn btn-outline btn-sm" style="width: 100%; border-color: #334155; color: #cbd5e1; justify-content: center;">
            <i data-lucide="log-out" style="width: 14px; height: 14px;"></i>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    `;

    document.getElementById('admin-logout-btn')?.addEventListener('click', () => {
      store.logout();
      window.location.href = 'index.html';
    });
  }

  if (topbarContainer) {
    topbarContainer.innerHTML = `
      <div class="admin-topbar">
        <div style="display: flex; align-items: center; gap: 16px;">
          <button id="admin-sidebar-toggle-btn" class="btn-icon show-on-mobile" style="display: none;">
            <i data-lucide="menu"></i>
          </button>
          <div>
            <h1 style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin: 0;" id="admin-page-title">
              ${getPageTitle(activePage)}
            </h1>
            <div style="font-size: 0.78rem; color: #64748b;">VK Kirana & Supermarket Koramangala Hub</div>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="display: inline-flex; align-items: center; gap: 6px; background: #ecfdf5; color: #059669; font-size: 0.8rem; font-weight: 700; padding: 6px 12px; border-radius: 20px;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; display: inline-block;"></span>
            Counter Live
          </span>

          <a href="index.html" class="btn btn-outline btn-sm">
            <i data-lucide="external-link" style="width: 14px; height: 14px;"></i>
            <span>View Storefront</span>
          </a>
        </div>
      </div>
    `;

    const toggleBtn = document.getElementById('admin-sidebar-toggle-btn');
    const sidebar = document.getElementById('admin-sidebar');
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }
  }
}

function getPageTitle(page) {
  switch (page) {
    case 'dashboard': return 'Dukan Business Dashboard';
    case 'pos': return 'Express POS Billing Counter';
    case 'inventory': return 'Inventory & Price Manager';
    case 'khata': return 'Digital Khata Book (Customer Credit)';
    case 'expenses': return 'Shop Daily Expenses & P&L';
    default: return 'Admin Portal';
  }
}
