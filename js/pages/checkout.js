// Checkout Page Controller for checkout.html

import { initCommonUI } from '../common.js';
import { store } from '../store.js';

document.addEventListener('DOMContentLoaded', () => {
  initCommonUI();

  const cart = store.getCart();
  if (cart.length === 0) {
    store.showToast('Your shopping bag is empty!', 'error');
    window.location.href = 'cart.html';
    return;
  }

  populateUserData();
  renderSummary();
  setupCheckoutForm();
});

function populateUserData() {
  const user = store.getUser();
  if (!user) return;

  const nameInput = document.getElementById('cust-name');
  const phoneInput = document.getElementById('cust-phone');
  const streetInput = document.getElementById('cust-street');
  const cityInput = document.getElementById('cust-city');
  const pincodeInput = document.getElementById('cust-pincode');

  if (nameInput) nameInput.value = user.name || '';
  if (phoneInput) phoneInput.value = user.phone || '';
  if (user.address) {
    if (streetInput) streetInput.value = user.address.street || '';
    if (cityInput && user.address.city) cityInput.value = `${user.address.city}`;
    if (pincodeInput && user.address.pincode) pincodeInput.value = user.address.pincode;
  }
}

function renderSummary() {
  const cart = store.getCart();
  const totals = store.getCartTotals();

  const preview = document.getElementById('checkout-items-preview');
  if (preview) {
    preview.innerHTML = cart.map(item => {
      const p = item.product;
      const price = p.discountPrice || p.price;
      return `
        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem;">
          <div style="flex: 1; min-width: 0; padding-right: 10px;">
            <div style="font-weight: 700; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</div>
            <div style="font-size: 0.75rem; color: #64748b;">Qty: ${item.quantity} × ₹${price}</div>
          </div>
          <span style="font-weight: 800; color: #0f172a;">₹${price * item.quantity}</span>
        </div>
      `;
    }).join('');
  }

  document.getElementById('chk-subtotal').textContent = `₹${totals.subtotal}`;
  document.getElementById('chk-delivery').textContent = totals.deliveryFee === 0 ? 'FREE' : `₹${totals.deliveryFee}`;
  if (totals.deliveryFee === 0) {
    document.getElementById('chk-delivery').style.color = '#059669';
  }
  document.getElementById('chk-handling').textContent = `₹${totals.handlingFee}`;

  const discountRow = document.getElementById('chk-discount-row');
  const discountVal = document.getElementById('chk-discount');
  if (totals.discount > 0) {
    discountRow.style.display = 'flex';
    discountVal.textContent = `-₹${totals.discount}`;
  } else {
    discountRow.style.display = 'none';
  }

  document.getElementById('chk-grand-total').textContent = `₹${totals.grandTotal}`;
}

function setupCheckoutForm() {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const street = document.getElementById('cust-street').value.trim();
    const city = document.getElementById('cust-city').value.trim();
    const pincode = document.getElementById('cust-pincode').value.trim();

    const slotEl = document.querySelector('input[name="delivery-slot"]:checked');
    const deliverySlot = slotEl ? slotEl.value : 'Express Instant (Within 15 Mins)';

    const payEl = document.querySelector('input[name="payment-method"]:checked');
    const paymentMethod = payEl ? payEl.value : 'UPI / Online QR';

    const cart = store.getCart();
    const totals = store.getCartTotals();

    const orderPayload = {
      customer: {
        name,
        phone,
        address: { street, city, pincode }
      },
      deliverySlot,
      paymentMethod,
      items: cart,
      subtotal: totals.subtotal,
      deliveryFee: totals.deliveryFee,
      handlingFee: totals.handlingFee,
      discount: totals.discount,
      total: totals.grandTotal
    };

    const newOrder = store.placeOrder(orderPayload);
    window.location.href = `order-success.html?orderId=${newOrder.id}`;
  });
}
