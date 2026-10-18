// Product Details Page Controller for product-details.html

import { initCommonUI, renderProductCard } from '../common.js';
import { initAiWidget } from '../ai-widget.js';
import { store } from '../store.js';

let currentProduct = null;
let selectedQuantity = 1;

document.addEventListener('DOMContentLoaded', () => {
  initCommonUI();
  initAiWidget();

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || 'atta-1';

  loadProduct(productId);
  setupDetailsListeners();

  store.subscribe((event) => {
    if (event === 'wishlist_changed' && currentProduct) {
      updateWishlistButtonUI();
    }
  });
});

function loadProduct(id) {
  currentProduct = store.getProductById(id);
  if (!currentProduct) {
    const products = store.getProducts();
    currentProduct = products[0];
  }

  document.title = `${currentProduct.name} - VKCommerce`;

  // Breadcrumbs
  const catLink = document.getElementById('breadcrumb-category-link');
  if (catLink) {
    catLink.href = `category.html?category=${currentProduct.category}`;
    catLink.textContent = currentProduct.categoryName || 'Category';
  }

  const nameCrumb = document.getElementById('breadcrumb-product-name');
  if (nameCrumb) nameCrumb.textContent = currentProduct.name;

  // Images
  const mainImg = document.getElementById('main-product-image');
  if (mainImg) {
    mainImg.src = currentProduct.image;
    mainImg.alt = currentProduct.name;
  }

  const gallery = document.getElementById('thumbnail-gallery');
  const images = currentProduct.images || [currentProduct.image];
  if (gallery) {
    gallery.innerHTML = images.map((imgUrl, idx) => `
      <img src="${imgUrl}" alt="${currentProduct.name} ${idx + 1}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 10px; cursor: pointer; border: 2px solid ${idx === 0 ? '#059669' : '#e2e8f0'};" onclick="document.getElementById('main-product-image').src='${imgUrl}'" />
    `).join('');
  }

  // Badges
  const badgesContainer = document.getElementById('detail-badges-container');
  if (badgesContainer) {
    badgesContainer.innerHTML = `
      ${currentProduct.discount ? `<span class="badge badge-discount">${currentProduct.discount}% OFF</span>` : ''}
      ${currentProduct.isDeal ? `<span class="badge badge-deal">🔥 HOT DEAL</span>` : ''}
      ${currentProduct.isFresh ? `<span class="badge badge-fresh">🥬 TAAZA</span>` : ''}
    `;
  }

  // Brand, Name, Rating
  document.getElementById('detail-brand').textContent = currentProduct.brand || 'VK Kirana';
  document.getElementById('detail-name').textContent = currentProduct.name;
  document.getElementById('detail-rating').textContent = currentProduct.rating || '4.8';
  document.getElementById('detail-reviews-count').textContent = currentProduct.reviewsCount || '1,240';
  document.getElementById('detail-unit-badge').textContent = currentProduct.unit;

  // Pricing
  const price = currentProduct.discountPrice || currentProduct.price;
  document.getElementById('detail-price-current').textContent = `₹${price}`;

  const origPriceEl = document.getElementById('detail-price-original');
  const discountTag = document.getElementById('detail-discount-tag');
  if (currentProduct.price > price) {
    origPriceEl.textContent = `₹${currentProduct.price}`;
    origPriceEl.style.display = 'inline';
    discountTag.textContent = `${currentProduct.discount}% OFF`;
    discountTag.style.display = 'inline-flex';
    document.getElementById('detail-savings-text').textContent = `You save ₹${currentProduct.price - price} (${currentProduct.discount}% discount) with wholesale dukan rate`;
  } else {
    origPriceEl.style.display = 'none';
    discountTag.style.display = 'none';
  }

  // Stock
  document.getElementById('detail-stock-count').textContent = currentProduct.stock;

  // Overview & Features
  document.getElementById('detail-description').textContent = currentProduct.description || 'Pure quality Kirana staple sourced directly from authentic suppliers.';
  const featuresList = document.getElementById('detail-features-list');
  if (featuresList) {
    const features = currentProduct.features || ['Wholesale kirana quality', 'No adulteration guaranteed', 'Hygienically packed'];
    featuresList.innerHTML = features.map(f => `<li>✓ ${f}</li>`).join('');
  }

  // Nutrition
  const nutritionWrapper = document.getElementById('nutrition-wrapper');
  const nutritionGrid = document.getElementById('nutrition-grid');
  if (currentProduct.nutrition && nutritionGrid) {
    nutritionWrapper.style.display = 'block';
    nutritionGrid.innerHTML = Object.entries(currentProduct.nutrition).map(([key, val]) => `
      <div style="background: #f8fafc; border-radius: 10px; padding: 10px; border: 1px solid #e2e8f0; text-align: center;">
        <div style="font-size: 0.72rem; text-transform: uppercase; color: #64748b; font-weight: 700;">${key}</div>
        <div style="font-size: 0.95rem; font-weight: 800; color: #0f172a; margin-top: 2px;">${val}</div>
      </div>
    `).join('');
  } else if (nutritionWrapper) {
    nutritionWrapper.style.display = 'none';
  }

  updateWishlistButtonUI();
  renderRelatedProducts();
}

function updateWishlistButtonUI() {
  const wishBtn = document.getElementById('detail-wishlist-btn');
  if (!wishBtn || !currentProduct) return;
  const isWish = store.isInWishlist(currentProduct.id);
  wishBtn.style.color = isWish ? '#ef4444' : '#64748b';
  wishBtn.style.backgroundColor = isWish ? '#fee2e2' : '#ffffff';
  wishBtn.style.borderColor = isWish ? '#fca5a5' : '#e2e8f0';
}

function setupDetailsListeners() {
  const decBtn = document.getElementById('qty-decrease-btn');
  const incBtn = document.getElementById('qty-increase-btn');
  const qtyText = document.getElementById('selected-qty-text');
  const addCartBtn = document.getElementById('detail-add-cart-btn');
  const wishBtn = document.getElementById('detail-wishlist-btn');

  if (decBtn && qtyText) {
    decBtn.addEventListener('click', () => {
      if (selectedQuantity > 1) {
        selectedQuantity--;
        qtyText.textContent = selectedQuantity;
      }
    });
  }

  if (incBtn && qtyText) {
    incBtn.addEventListener('click', () => {
      if (currentProduct && selectedQuantity < currentProduct.stock) {
        selectedQuantity++;
        qtyText.textContent = selectedQuantity;
      } else {
        store.showToast(`Only ${currentProduct?.stock} available in stock!`, 'error');
      }
    });
  }

  if (addCartBtn) {
    addCartBtn.addEventListener('click', () => {
      if (currentProduct) {
        store.addToCart(currentProduct, selectedQuantity);
      }
    });
  }

  if (wishBtn) {
    wishBtn.addEventListener('click', () => {
      if (currentProduct) {
        store.toggleWishlist(currentProduct);
      }
    });
  }
}

function renderRelatedProducts() {
  const container = document.getElementById('related-products-grid');
  if (!container || !currentProduct) return;

  const products = store.getProducts();
  const related = products
    .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
    .slice(0, 4);

  container.innerHTML = related.map(p => renderProductCard(p)).join('');
}
