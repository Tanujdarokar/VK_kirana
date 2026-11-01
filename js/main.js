// Apni Kirana - Global UI Interactions & Utilities

// Toast Notification System
window.showToast = function(message, type = 'success', duration = 3000) {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icon = type === 'success' ? 'fa-circle-check' :
               type === 'error' ? 'fa-circle-xmark' :
               type === 'warning' ? 'fa-triangle-exclamation' : 'fa-circle-info';

  toast.innerHTML = `
    <i class="fas ${icon}"></i>
    <span>${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
};

// Global Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Apply saved theme (Dark Mode)
  const isDarkMode = localStorage.getItem('apnikirana_theme') === 'dark';
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
  }

  // Apply language engine
  if (window.LangEngine) {
    window.LangEngine.applyTranslations();
  }

  // Bind Language Switcher Buttons
  document.addEventListener('click', (e) => {
    const langBtn = e.target.closest('.lang-btn');
    if (langBtn) {
      const lang = langBtn.getAttribute('data-lang');
      if (window.LangEngine) {
        window.LangEngine.setLanguage(lang);
      }
    }

    // Theme Toggle Button
    const themeBtn = e.target.closest('.theme-toggle-btn');
    if (themeBtn) {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('apnikirana_theme', isDark ? 'dark' : 'light');
      if (window.showToast) window.showToast(`Switched to ${isDark ? 'Dark' : 'Light'} Mode 🌙`, "info");
    }

    // Mobile Menu Toggle Button
    const mobileToggle = e.target.closest('.mobile-menu-toggle');
    if (mobileToggle) {
      const navMenu = document.querySelector('.nav-links-menu');
      if (navMenu) {
        navMenu.classList.toggle('open');
      }
    }
  });

  // Global Live Search Bar Suggestions
  const searchInputs = document.querySelectorAll('.global-search-input');
  searchInputs.forEach(input => {
    const dropdown = input.nextElementSibling && input.nextElementSibling.classList.contains('search-dropdown')
      ? input.nextElementSibling
      : null;

    if (!dropdown) return;

    input.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (query.length < 1) {
        dropdown.style.display = 'none';
        return;
      }

      const products = window.ProductStore ? window.ProductStore.getProducts() : [];
      const matches = products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        (p.hindiName && p.hindiName.toLowerCase().includes(query)) ||
        p.brand.toLowerCase().includes(query) ||
        p.categoryName.toLowerCase().includes(query)
      ).slice(0, 5);

      if (matches.length === 0) {
        dropdown.innerHTML = `
          <div class="dropdown-item empty">
            <span>No products found for "${query}"</span>
          </div>
        `;
      } else {
        dropdown.innerHTML = matches.map(p => `
          <a href="product-details.html?id=${p.id}" class="dropdown-item">
            <img src="${p.image}" alt="${p.name}" />
            <div>
              <div class="title">${p.name}</div>
              <div class="meta">${p.unit} • ₹${p.discountPrice || p.price}</div>
            </div>
          </a>
        `).join('');
      }

      dropdown.style.display = 'block';
    });

    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });
  });
});

// Helper to open WhatsApp order enquiry
window.openWhatsAppEnquiry = function(msg = '') {
  const phone = "919876543210";
  const defaultText = "Namaste Apni Kirana! I would like to inquire about placing an order for daily groceries.";
  const text = encodeURIComponent(msg || defaultText);
  window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
};
