// Cart Page Controller for cart.html

import { initCommonUI } from '../common.js';
import { initAiWidget } from '../ai-widget.js';
import { store } from '../store.js';

document.addEventListener('DOMContentLoaded', () => {
  initCommonUI();
  initAiWidget();
  renderCart();
  setupCartListeners();

  store.subscribe((event) => {
    if (event === 'cart_changed') {
      renderCart();
    }
  });
});

function renderCart() {
  const cart = store.getCart();
  const totals = store.getCartTotals();

  const contentWrapper = document.getElementById('cart-content-wrapper');
  const emptyState = document.getElementById('cart-empty-state');
  const freeDeliveryCard = document.getElementById('free-delivery-bar-card');
  const clearBtn = document.getElementById('clear-cart-btn');

  if (cart.length === 0) {
    if (contentWrapper) contentWrapper.style.display = 'none';
    if (freeDeliveryCard) freeDeliveryCard.style.display = 'none';
    if (clearBtn) clearBtn.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (contentWrapper) contentWrapper.style.display = 'grid';
  if (freeDeliveryCard) freeDeliveryCard.style.display = 'block';
  if (clearBtn) clearBtn.style.display = 'inline-flex';
  if (emptyState) emptyState.style.display = 'none';

  // Free delivery progress
  const freeText = document.getElementById('free-delivery-text');
  const progress = document.getElementById('free-delivery-progress');
  if (totals.subtotal >= 499) {
    if (freeText) freeText.innerHTML = '🎉 You unlocked <strong>FREE 15-Min Delivery</strong>!';
    if (progress) progress.style.width = '100%';
  } else {
    const pct = Math.min(100, Math.round((totals.subtotal / 499) * 100));
    if (freeText) freeText.innerHTML = `Add <strong>₹${totals.freeDeliveryGap}</strong> more for FREE Delivery!`;
    if (progress) progress.style.width = `${pct}%`;
  }

  // Cart Items Count
  const countEl = document.getElementById('cart-items-count');
  if (countEl) countEl.textContent = totals.totalItems;

  // Cart Items List
  const listContainer = document.getElementById('cart-items-list');
  if (listContainer) {
    listContainer.innerHTML = cart.map(item => {
      const p = item.product;
      const price = p.discountPrice || p.price;
      const lineTotal = price * item.quantity;

      return `
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 0; border-bottom: 1px solid #f1f5f9; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 14px; min-width: 240px; flex: 1;">
            <img src="${p.image}" alt="${p.name}" style="width: 64px; height: 64px; object-fit: cover; border-radius: 12px; background: #f8fafc;" />
            <div>
              <div style="font-size: 0.75rem; font-weight: 700; color: #059669; text-transform: uppercase;">${p.brand || 'Kirana'}</div>
              <a href="product-details.html?id=${p.id}" style="font-size: 0.95rem; font-weight: 700; color: #0f172a; text-decoration: none;">${p.name}</a>
              <div style="font-size: 0.8rem; color: #64748b; margin-top: 2px;">${p.unit} • ₹${price} each</div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 20px;">
            <div style="display: flex; align-items: center; border: 1.5px solid #cbd5e1; border-radius: 8px; overflow: hidden; background: white;">
              <button class="cart-qty-btn" style="width: 32px; height: 32px; font-weight: 800; font-size: 1rem; color: #0f172a;" onclick="window.vkUpdateCart('${p.id}', ${item.quantity - 1})">-</button>
              <span style="width: 32px; text-align: center; font-weight: 800; font-size: 0.9rem; color: #0f172a;">${item.quantity}</span>
              <button class="cart-qty-btn" style="width: 32px; height: 32px; font-weight: 800; font-size: 1rem; color: #0f172a;" onclick="window.vkUpdateCart('${p.id}', ${item.quantity + 1})">+</button>
            </div>

            <div style="font-size: 1.05rem; font-weight: 900; color: #0f172a; min-width: 60px; text-align: right;">
              ₹${lineTotal}
            </div>

            <button class="btn-icon" style="width: 32px; height: 32px; color: #94a3b8;" onclick="window.vkRemoveFromCart('${p.id}')" title="Remove item">
              ✕
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Summary Card values
  document.getElementById('summary-subtotal').textContent = `₹${totals.subtotal}`;
  document.getElementById('summary-delivery-fee').textContent = totals.deliveryFee === 0 ? 'FREE' : `₹${totals.deliveryFee}`;
  if (totals.deliveryFee === 0) {
    document.getElementById('summary-delivery-fee').style.color = '#059669';
  } else {
    document.getElementById('summary-delivery-fee').style.color = '#0f172a';
  }

  document.getElementById('summary-handling-fee').textContent = `₹${totals.handlingFee}`;

  const discountRow = document.getElementById('summary-discount-row');
  const discountVal = document.getElementById('summary-discount');
  const couponPill = document.getElementById('applied-coupon-pill');
  const appliedCodeText = document.getElementById('applied-coupon-code');
  const appliedCoupon = store.getAppliedCoupon();

  if (totals.discount > 0 && appliedCoupon) {
    discountRow.style.display = 'flex';
    discountVal.textContent = `-₹${totals.discount}`;
    couponPill.style.display = 'flex';
    appliedCodeText.textContent = appliedCoupon;
  } else {
    discountRow.style.display = 'none';
    couponPill.style.display = 'none';
  }

  document.getElementById('summary-grand-total').textContent = `₹${totals.grandTotal}`;
}

function setupCartListeners() {
  const clearBtn = document.getElementById('clear-cart-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear your shopping bag?')) {
        store.clearCart();
      }
    });
  }

  const applyBtn = document.getElementById('apply-coupon-btn');
  const couponInput = document.getElementById('coupon-input');
  if (applyBtn && couponInput) {
    applyBtn.addEventListener('click', () => {
      const code = couponInput.value.trim();
      if (!code) {
        store.showToast('Please enter a coupon code!', 'error');
        return;
      }
      store.applyCoupon(code);
      couponInput.value = '';
    });
  }

  const removeCouponBtn = document.getElementById('remove-coupon-btn');
  if (removeCouponBtn) {
    removeCouponBtn.addEventListener('click', () => {
      store.removeCoupon();
    });
  }
}

window.vkRemoveFromCart = (id) => {
  store.removeFromCart(id);
};
