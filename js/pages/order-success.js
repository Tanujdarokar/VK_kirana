// Order Success Page Controller for order-success.html

import { initCommonUI } from '../common.js';
import { store } from '../store.js';

document.addEventListener('DOMContentLoaded', () => {
  initCommonUI();

  // Trigger festive confetti fireworks
  if (typeof window.confetti === 'function') {
    window.confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('orderId');

  const order = orderId ? store.getOrderById(orderId) : store.getOrders()[0];
  if (order) {
    renderOrderDetails(order);
  }

  const printBtn = document.getElementById('print-receipt-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
});

function renderOrderDetails(order) {
  document.getElementById('success-order-id').textContent = order.id;

  const itemsList = document.getElementById('success-items-list');
  if (itemsList && order.items) {
    itemsList.innerHTML = order.items.map(item => {
      const p = item.product;
      const price = p.discountPrice || p.price;
      return `
        <div class="receipt-item-row" style="display: flex; align-items: center; justify-content: space-between; font-size: 0.9rem; padding: 6px 0;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="${p.image}" alt="${p.name}" loading="lazy" decoding="async" width="42" height="42" style="width: 42px; height: 42px; object-fit: cover; border-radius: 8px;" />
            <div>
              <div style="font-weight: 700; color: #0f172a;">${p.name}</div>
              <div style="font-size: 0.78rem; color: #64748b;">${p.unit} • Qty: ${item.quantity}</div>
            </div>
          </div>
          <span style="font-weight: 800; color: #0f172a;">₹${price * item.quantity}</span>
        </div>
      `;
    }).join('');
  }

  document.getElementById('success-payment-method').textContent = order.paymentMethod || 'UPI / Online';
  
  if (order.customer && order.customer.address) {
    const a = order.customer.address;
    document.getElementById('success-address').textContent = `${a.street}, ${a.city} - ${a.pincode}`;
  }

  document.getElementById('success-total-amount').textContent = `₹${order.total}`;
}
