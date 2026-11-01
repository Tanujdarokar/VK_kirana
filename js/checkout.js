// Apni Kirana - Checkout & Order Placement Engine

class CheckoutManager {
  constructor() {
    this.orderKey = 'apnikirana_orders';
  }

  getOrders() {
    try {
      const saved = localStorage.getItem(this.orderKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  saveOrders(orders) {
    localStorage.setItem(this.orderKey, JSON.stringify(orders));
  }

  placeOrder(formData, paymentMethod, deliverySlot) {
    const bill = window.Cart.getBillDetails();
    if (bill.items.length === 0) {
      if (window.showToast) window.showToast("Your cart is empty!", "error");
      return null;
    }

    // Generate unique order ID
    const orderId = 'AK-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      status: 'Placed', // 'Placed' | 'Confirmed' | 'Packing' | 'Out for Delivery' | 'Ready for Pickup' | 'Delivered'
      customer: {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || '',
        address: {
          house: formData.house || '',
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        }
      },
      deliverySlot: deliverySlot || 'Express 15-30 Mins',
      paymentMethod,
      items: bill.items.map(i => ({
        id: i.product.id,
        name: i.product.name,
        hindiName: i.product.hindiName,
        price: i.unitPrice,
        unit: i.product.unit,
        image: i.product.image,
        quantity: i.quantity,
        subtotal: i.itemSubtotal
      })),
      subtotal: bill.itemsTotal,
      deliveryFee: bill.deliveryFee,
      handlingFee: bill.handlingFee,
      discount: bill.couponDiscount,
      totalAmount: bill.grandTotal
    };

    const orders = this.getOrders();
    orders.unshift(newOrder);
    this.saveOrders(orders);

    // Deduct stock from inventory
    const products = window.ProductStore.getProducts();
    bill.items.forEach(cartItem => {
      const p = products.find(prod => prod.id === cartItem.productId);
      if (p) {
        p.stock = Math.max(0, p.stock - cartItem.quantity);
      }
    });
    window.ProductStore.saveProducts(products);

    // Clear cart
    window.Cart.clearCart();

    return newOrder;
  }

  getOrderById(orderId) {
    const orders = this.getOrders();
    return orders.find(o => o.id === orderId);
  }

  updateOrderStatus(orderId, newStatus) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      this.saveOrders(orders);
      if (window.showToast) window.showToast(`Order #${orderId} status updated to: ${newStatus}`, "info");
    }
  }
}

window.Checkout = new CheckoutManager();
