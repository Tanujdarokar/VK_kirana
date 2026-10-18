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

  // Standard Login Form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      const res = store.login(email, password);
      if (res.success) {
        if (res.user.role === 'vendor') {
          window.location.href = 'admin.html';
        } else {
          window.location.href = 'products.html';
        }
      }
    });
  }

  // Registration Form
  const regForm = document.getElementById('register-form');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const phone = document.getElementById('reg-phone').value.trim();
      const password = document.getElementById('reg-password').value;

      const res = store.register({ name, email, phone, password });
      if (res.success) {
        window.location.href = 'products.html';
      }
    });
  }
}
