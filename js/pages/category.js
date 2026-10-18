// Category Page Controller for category.html

import { initCommonUI, renderProductCard } from '../common.js';
import { store } from '../store.js';
import { categories } from '../data/categories.js';

let currentCategorySlug = '';
let currentSort = 'featured';

document.addEventListener('DOMContentLoaded', () => {
  initCommonUI();

  const urlParams = new URLSearchParams(window.location.search);
  currentCategorySlug = urlParams.get('category') || 'atta-flour-grains';

  loadCategoryInfo();
  renderProducts();

  const sortSelect = document.getElementById('cat-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderProducts();
    });
  }

  store.subscribe((event) => {
    if (event === 'cart_changed' || event === 'inventory_changed') {
      renderProducts();
    }
  });
});

function loadCategoryInfo() {
  const cat = categories.find(c => c.slug === currentCategorySlug) || categories[0];
  if (!cat) return;

  document.title = `${cat.name} - VKCommerce Grocery`;
  const breadcrumb = document.getElementById('breadcrumb-category-name');
  if (breadcrumb) breadcrumb.textContent = cat.name;

  const title = document.getElementById('category-title');
  if (title) title.textContent = cat.name;

  const desc = document.getElementById('category-desc');
  if (desc) desc.textContent = cat.description;

  const img = document.getElementById('category-image');
  if (img) {
    img.src = cat.image;
    img.alt = cat.name;
  }

  const bannerCard = document.getElementById('category-banner-card');
  if (bannerCard && cat.color) {
    bannerCard.style.backgroundColor = cat.color;
    bannerCard.style.borderColor = cat.accentColor || '#e2e8f0';
  }
}

function renderProducts() {
  const products = store.getProducts();
  let filtered = products.filter(p => p.category === currentCategorySlug);

  if (currentSort === 'price-asc') {
    filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
  } else if (currentSort === 'price-desc') {
    filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
  } else if (currentSort === 'rating') {
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  const countEl = document.getElementById('category-item-count');
  if (countEl) countEl.textContent = filtered.length;

  const grid = document.getElementById('category-products-grid');
  if (grid) {
    if (filtered.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; padding: 40px; text-align: center; color: #64748b;">No products currently found in this category.</div>`;
    } else {
      grid.innerHTML = filtered.map(p => renderProductCard(p)).join('');
    }
  }
}
