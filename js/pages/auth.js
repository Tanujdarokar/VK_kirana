// Authentication Controller for login.html & register.html

import { initCommonUI } from '../common.js';
import { store } from '../store.js';

document.addEventListener('DOMContentLoaded', () => {
  initCommonUI();
  setupAuthListeners();
});

function setupAuthListeners() {
  // Demo 1-click logins
  const demoCustBtn = document.getElementById('demo-customer-login-btn');
  const demoVendBtn = document.getElementById('demo-vendor-login-btn');

  if (demoCustBtn) {
    demoCustBtn.addEventListener('click', () => {
      store.loginAsCustomer();
      window.location.href = 'products.html';
    });
  }

  if (demoVendBtn) {
    demoVendBtn.addEventListener('click', () => {
      store.loginAsVendor();
      window.location.href = 'admin.html';
    });
  }

  // Registration Form
  const regForm = document.getElementById('register-form');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (document.getElementById('reg-company').value) return;
      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const phone = document.getElementById('reg-phone').value.trim();

      const res = store.register({ name, email, phone });
      if (res.success) {
        window.location.href = 'products.html';
      }
    });
  }
}
