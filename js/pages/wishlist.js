// Wishlist Page Controller for wishlist.html

import { initCommonUI, renderProductCard } from '../common.js';
import { initAiWidget } from '../ai-widget.js';
import { store } from '../store.js';

document.addEventListener('DOMContentLoaded', () => {
  initCommonUI();
  initAiWidget();
  renderWishlist();

  store.subscribe((event) => {
    if (event === 'wishlist_changed' || event === 'cart_changed') {
      renderWishlist();
    }
  });
});

function renderWishlist() {
  const wishlist = store.getWishlist();
  const grid = document.getElementById('wishlist-products-grid');
  const emptyState = document.getElementById('wishlist-empty-state');

  if (wishlist.length === 0) {
    if (grid) grid.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (grid) {
    grid.style.display = 'grid';
    grid.innerHTML = wishlist.map(p => renderProductCard(p)).join('');
  }
}
