// Orders Page Controller for orders.html

import { initCommonUI } from '../common.js';
import { store } from '../store.js';

document.addEventListener('DOMContentLoaded', () => {
  initCommonUI();
  renderOrders();

  store.subscribe((event) => {
    if (event === 'orders_changed') {
      renderOrders();
    }
  });
});

function renderOrders() {
  const orders = store.getOrders();
  const container = document.getElementById('orders-list-container');
  const emptyState = document.getElementById('orders-empty-state');

  if (orders.length === 0) {
    if (container) container.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (container) {
    container.style.display = 'flex';
    container.innerHTML = orders.map(order => {
      const dateStr = new Date(order.date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      let statusBadge = `<span class="badge badge-fresh">${order.status}</span>`;
      if (order.status === 'Cancelled') {
        statusBadge = `<span class="badge" style="background:#fee2e2;color:#ef4444;">Cancelled</span>`;
      } else if (order.status === 'Confirmed') {
        statusBadge = `<span class="badge badge-deal">⚡ Out for 15-Min Delivery</span>`;
      }

      return `
        <div class="card" style="padding: 24px; border-radius: 20px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 14px; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
            <div>
              <div style="font-weight: 900; font-size: 1.1rem; color: #0f172a;">${order.id}</div>
              <div style="font-size: 0.8rem; color: #64748b;">Placed on ${dateStr}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              ${statusBadge}
              <span style="font-weight: 900; font-size: 1.15rem; color: #059669;">₹${order.total}</span>
            </div>
          </div>

          <!-- Items Row -->
          <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;">
            ${(order.items || []).map(item => `
              <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.88rem;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <img src="${item.product.image}" alt="${item.product.name}" style="width: 36px; height: 36px; object-fit: cover; border-radius: 8px;" />
                  <div>
                    <span style="font-weight: 700; color: #0f172a;">${item.product.name}</span>
                    <span style="font-size: 0.78rem; color: #64748b; margin-left: 6px;">(${item.product.unit})</span>
                  </div>
                </div>
                <div style="font-weight: 700; color: #475569;">
                  Qty: ${item.quantity} × ₹${item.product.discountPrice || item.product.price}
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Footer Actions -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 14px; flex-wrap: wrap; gap: 10px;">
            <div style="font-size: 0.82rem; color: #64748b;">
              Payment: <strong>${order.paymentMethod || 'Online'}</strong>
            </div>

            <div style="display: flex; gap: 10px;">
              ${order.status === 'Confirmed' ? `
                <button class="btn btn-outline btn-sm" style="color: #ef4444; border-color: #fee2e2;" onclick="window.vkCancelOrder('${order.id}')">
                  Cancel Order
                </button>
              ` : ''}

              <button class="btn btn-primary btn-sm" onclick="window.vkReorder('${order.id}')">
                🔄 Reorder All
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
}

window.vkReorder = (orderId) => {
  const order = store.getOrderById(orderId);
  if (order && order.items) {
    order.items.forEach(item => {
      store.addToCart(item.product, item.quantity);
    });
    store.showToast('Reordered all items into your bag!');
    window.location.href = 'cart.html';
  }
};

window.vkCancelOrder = (orderId) => {
  if (confirm(`Are you sure you want to cancel order ${orderId}?`)) {
    store.cancelOrder(orderId);
  }
};
