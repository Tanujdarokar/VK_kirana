// Home Page Logic for index.html

import { initCommonUI, renderProductCard } from '../common.js';
import { store } from '../store.js';
import { categories } from '../data/categories.js';

document.addEventListener('DOMContentLoaded', () => {
  initCommonUI();
  renderCategories();
  renderDeals();
  renderPopular();

  // Re-render when inventory or cart changes
  store.subscribe((event) => {
    if (event === 'cart_changed' || event === 'inventory_changed') {
      renderDeals();
      renderPopular();
    }
  });
});

function renderCategories() {
  const container = document.getElementById('home-categories-grid');
  if (!container) return;

  container.innerHTML = categories.map(cat => `
    <a href="category.html?category=${cat.slug}" class="category-card">
      <div class="category-icon-box" style="background-color: ${cat.color};">
        <img src="${cat.image}" alt="${cat.name}" loading="lazy" decoding="async" width="120" height="120" style="width: 100%; height: 100%; object-fit: cover;" />
      </div>
      <div class="category-name">${cat.name}</div>
      <div class="category-count">${cat.itemCount || 8}+ Items</div>
    </a>
  `).join('');
}

function renderDeals() {
  const container = document.getElementById('home-deals-grid');
  if (!container) return;

  const products = store.getProducts();
  const deals = products.filter(p => p.isDeal || p.discount >= 8).slice(0, 8);

  container.innerHTML = deals.map(p => renderProductCard(p)).join('');
}

function renderPopular() {
  const container = document.getElementById('home-popular-grid');
  if (!container) return;

  const products = store.getProducts();
  const popular = products.filter(p => p.isPopular || p.rating >= 4.8).slice(0, 8);

  container.innerHTML = popular.map(p => renderProductCard(p)).join('');
}
