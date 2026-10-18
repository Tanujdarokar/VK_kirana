// Profile Page Controller for profile.html

import { initCommonUI } from '../common.js';
import { store } from '../store.js';

document.addEventListener('DOMContentLoaded', () => {
  initCommonUI();
  loadUserProfile();
  setupProfileListeners();
});

function loadUserProfile() {
  const user = store.getUser();
  if (!user) return;

  document.getElementById('profile-avatar-letter').textContent = user.name ? user.name.charAt(0) : 'U';
  document.getElementById('profile-name-heading').textContent = user.name;
  document.getElementById('profile-email-text').textContent = user.email;

  const roleBadge = document.getElementById('profile-role-badge');
  if (roleBadge) {
    if (user.role === 'vendor') {
      roleBadge.textContent = 'Store Owner / Vendor';
      roleBadge.className = 'badge badge-fresh';
    } else {
      roleBadge.textContent = 'Customer';
      roleBadge.className = 'badge badge-popular';
    }
  }

  document.getElementById('prof-name').value = user.name || '';
  document.getElementById('prof-phone').value = user.phone || '';

  if (user.address) {
    document.getElementById('prof-street').value = user.address.street || '';
    document.getElementById('prof-city').value = user.address.city || '';
    document.getElementById('prof-pincode').value = user.address.pincode || '';
  }
}

function setupProfileListeners() {
  const form = document.getElementById('profile-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('prof-name').value.trim();
      const phone = document.getElementById('prof-phone').value.trim();
      const street = document.getElementById('prof-street').value.trim();
      const city = document.getElementById('prof-city').value.trim();
      const pincode = document.getElementById('prof-pincode').value.trim();

      store.updateProfile({
        name,
        phone,
        address: { street, city, pincode }
      });

      loadUserProfile();
    });
  }

  const logoutBtn = document.getElementById('profile-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      store.logout();
      window.location.href = 'index.html';
    });
  }

  const switchCust = document.getElementById('prof-switch-cust-btn');
  const switchVend = document.getElementById('prof-switch-vend-btn');

  if (switchCust) {
    switchCust.addEventListener('click', () => {
      store.loginAsCustomer();
      loadUserProfile();
    });
  }

  if (switchVend) {
    switchVend.addEventListener('click', () => {
      store.loginAsVendor();
      loadUserProfile();
    });
  }
}
