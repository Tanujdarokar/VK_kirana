// Products Catalog Controller for products.html

import { initCommonUI, renderProductCard } from '../common.js';
import { initAiWidget } from '../ai-widget.js';
import { store } from '../store.js';
import { categories } from '../data/categories.js';
import { getExpandedSearchTerms } from '../data/aiAssistant.js';

let activeCategory = 'all';
let maxPrice = 1000;
let dealsOnly = false;
let freshOnly = false;
let currentSort = 'featured';
let searchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
  initCommonUI();
  initAiWidget();

  // Read URL query params
  const urlParams = new URLSearchParams(window.location.search);
  searchQuery = urlParams.get('search') || '';
  activeCategory = urlParams.get('category') || 'all';
  if (urlParams.get('deal') === 'true') {
    dealsOnly = true;
    const dealsCheckbox = document.getElementById('filter-deals-only');
    if (dealsCheckbox) dealsCheckbox.checked = true;
  }

  // Pre-fill search input if query was passed
  const searchInput = document.getElementById('global-search-input');
  if (searchInput && searchQuery) {
    searchInput.value = searchQuery;
  }

  renderCategoryFilters();
  setupFilterListeners();
  filterAndRender();

  store.subscribe((event) => {
    if (event === 'cart_changed' || event === 'inventory_changed') {
      filterAndRender();
    }
  });
});

function renderCategoryFilters() {
  const container = document.getElementById('filter-categories-list');
  if (!container) return;

  container.innerHTML = `
    <label style="display: flex; align-items: center; gap: 8px; font-size: 0.88rem; cursor: pointer;">
      <input type="radio" name="cat-filter" value="all" ${activeCategory === 'all' ? 'checked' : ''} style="accent-color: #059669;" />
      <span style="font-weight: 600;">All Groceries</span>
    </label>
    ${categories.map(c => `
      <label style="display: flex; align-items: center; gap: 8px; font-size: 0.88rem; cursor: pointer;">
        <input type="radio" name="cat-filter" value="${c.slug}" ${activeCategory === c.slug ? 'checked' : ''} style="accent-color: #059669;" />
        <span style="font-weight: 600;">${c.name}</span>
      </label>
    `).join('')}
  `;
}

function setupFilterListeners() {
  // Category radio change
  const catContainer = document.getElementById('filter-categories-list');
  if (catContainer) {
    catContainer.addEventListener('change', (e) => {
      activeCategory = e.target.value;
      filterAndRender();
    });
  }

  // Price slider
  const slider = document.getElementById('price-slider');
  const sliderVal = document.getElementById('price-slider-val');
  if (slider && sliderVal) {
    slider.addEventListener('input', (e) => {
      maxPrice = Number(e.target.value);
      sliderVal.textContent = `₹${maxPrice}`;
      filterAndRender();
    });
  }

  // Checkboxes
  const dealsCb = document.getElementById('filter-deals-only');
  if (dealsCb) {
    dealsCb.addEventListener('change', (e) => {
      dealsOnly = e.target.checked;
      filterAndRender();
    });
  }

  const freshCb = document.getElementById('filter-fresh-only');
  if (freshCb) {
    freshCb.addEventListener('change', (e) => {
      freshOnly = e.target.checked;
      filterAndRender();
    });
  }

  // Sort
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      filterAndRender();
    });
  }

  // Reset
  const resetBtn = document.getElementById('clear-filters-btn');
  const emptyResetBtn = document.getElementById('empty-reset-btn');
  const handleReset = () => {
    activeCategory = 'all';
    maxPrice = 1000;
    dealsOnly = false;
    freshOnly = false;
    searchQuery = '';
    currentSort = 'featured';

    if (slider) {
      slider.value = 1000;
      sliderVal.textContent = '₹1000';
    }
    if (dealsCb) dealsCb.checked = false;
    if (freshCb) freshCb.checked = false;
    if (sortSelect) sortSelect.value = 'featured';
    renderCategoryFilters();

    const searchInput = document.getElementById('global-search-input');
    if (searchInput) searchInput.value = '';

    filterAndRender();
  };

  if (resetBtn) resetBtn.addEventListener('click', handleReset);
  if (emptyResetBtn) emptyResetBtn.addEventListener('click', handleReset);
}

function filterAndRender() {
  const products = store.getProducts();
  const expanded = searchQuery ? getExpandedSearchTerms(searchQuery.toLowerCase().trim()) : [];

  let filtered = products.filter(p => {
    // Search match
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      const text = [p.name, p.brand, p.categoryName, p.description || ''].join(' ').toLowerCase();
      const matchesSearch = text.includes(q) || expanded.some(term => text.includes(term));
      if (!matchesSearch) return false;
    }

    // Category match
    if (activeCategory !== 'all' && p.category !== activeCategory) {
      return false;
    }

    // Price match
    const price = p.discountPrice || p.price;
    if (price > maxPrice) {
      return false;
    }

    // Deals & Fresh
    if (dealsOnly && !p.isDeal && (p.discount || 0) < 5) return false;
    if (freshOnly && !p.isFresh) return false;

    return true;
  });

  // Sort
  if (currentSort === 'price-asc') {
    filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
  } else if (currentSort === 'price-desc') {
    filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
  } else if (currentSort === 'rating') {
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (currentSort === 'discount') {
    filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
  }

  // Render
  const grid = document.getElementById('catalog-products-grid');
  const emptyState = document.getElementById('catalog-empty-state');
  const countEl = document.getElementById('products-count');

  if (countEl) countEl.textContent = filtered.length;

  if (filtered.length === 0) {
    if (grid) grid.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
  } else {
    if (emptyState) emptyState.style.display = 'none';
    if (grid) {
      grid.style.display = 'grid';
      grid.innerHTML = filtered.map(p => renderProductCard(p)).join('');
    }
  }
}
