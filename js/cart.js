// Apni Kirana - Cart Engine with LocalStorage, Coupons & Bill Calculation

class CartManager {
  constructor() {
    this.cartKey = 'apnikirana_cart';
    this.couponKey = 'apnikirana_coupon';
    this.freeDeliveryThreshold = 499;
    this.standardDeliveryFee = 40;
    this.handlingFee = 5;
  }

  getCart() {
    try {
      const saved = localStorage.getItem(this.cartKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  saveCart(cart) {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    this.updateCartUI();
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));
  }

  getAppliedCoupon() {
    try {
      const saved = localStorage.getItem(this.couponKey);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  saveCoupon(coupon) {
    if (coupon) {
      localStorage.setItem(this.couponKey, JSON.stringify(coupon));
    } else {
      localStorage.removeItem(this.couponKey);
    }
    this.updateCartUI();
  }

  addToCart(productId, quantity = 1) {
    const products = window.ProductStore ? window.ProductStore.getProducts() : [];
    const product = products.find(p => p.id === productId);

    if (!product) {
      if (window.showToast) window.showToast("Product not found!", "error");
      return;
    }

    if (product.stock <= 0) {
      if (window.showToast) window.showToast("Item is currently out of stock!", "error");
      return;
    }

    let cart = this.getCart();
    const existingIndex = cart.findIndex(item => item.productId === productId);

    if (existingIndex > -1) {
      const newQty = cart[existingIndex].quantity + quantity;
      if (newQty > product.stock) {
        if (window.showToast) window.showToast(`Only ${product.stock} units available in stock!`, "warning");
        return;
      }
      cart[existingIndex].quantity = newQty;
      if (window.showToast) window.showToast(`Updated ${product.name} quantity to ${newQty}`, "success");
    } else {
      if (quantity > product.stock) {
        if (window.showToast) window.showToast(`Only ${product.stock} units available in stock!`, "warning");
        return;
      }
      cart.push({
        productId,
        quantity,
        addedAt: new Date().toISOString()
      });
      if (window.showToast) window.showToast(`Added ${product.name} to cart! 🛒`, "success");
    }

    this.saveCart(cart);
  }

  updateQuantity(productId, newQty) {
    let cart = this.getCart();
    if (newQty <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const products = window.ProductStore ? window.ProductStore.getProducts() : [];
    const product = products.find(p => p.id === productId);

    if (product && newQty > product.stock) {
      if (window.showToast) window.showToast(`Maximum stock available is ${product.stock}`, "warning");
      return;
    }

    const item = cart.find(i => i.productId === productId);
    if (item) {
      item.quantity = newQty;
      this.saveCart(cart);
    }
  }

  removeFromCart(productId) {
    let cart = this.getCart();
    cart = cart.filter(i => i.productId !== productId);
    this.saveCart(cart);
    if (window.showToast) window.showToast("Item removed from cart", "info");
  }

  clearCart() {
    localStorage.removeItem(this.cartKey);
    localStorage.removeItem(this.couponKey);
    this.updateCartUI();
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: [] } }));
  }

  getBillDetails() {
    const cart = this.getCart();
    const products = window.ProductStore ? window.ProductStore.getProducts() : [];

    let itemsTotal = 0;
    let originalTotal = 0;
    let totalItemsCount = 0;

    const detailedItems = cart.map(cartItem => {
      const product = products.find(p => p.id === cartItem.productId);
      if (!product) return null;

      const price = product.discountPrice || product.price;
      const itemSubtotal = price * cartItem.quantity;
      const itemOriginalSubtotal = product.price * cartItem.quantity;

      itemsTotal += itemSubtotal;
      originalTotal += itemOriginalSubtotal;
      totalItemsCount += cartItem.quantity;

      return {
        ...cartItem,
        product,
        unitPrice: price,
        itemSubtotal
      };
    }).filter(Boolean);

    const productSavings = originalTotal - itemsTotal;
    const deliveryFee = itemsTotal >= this.freeDeliveryThreshold || detailedItems.length === 0 ? 0 : this.standardDeliveryFee;
    const handlingFee = detailedItems.length === 0 ? 0 : this.handlingFee;

    // Coupon discount logic
    let couponDiscount = 0;
    const appliedCoupon = this.getAppliedCoupon();
    if (appliedCoupon && detailedItems.length > 0) {
      if (appliedCoupon.code === 'KIRANA10') {
        couponDiscount = Math.round(itemsTotal * 0.10);
      } else if (appliedCoupon.code === 'WELCOME50' && itemsTotal >= 300) {
        couponDiscount = 50;
      }
    }

    const grandTotal = Math.max(0, itemsTotal + deliveryFee + handlingFee - couponDiscount);
    const amountNeededForFreeDelivery = Math.max(0, this.freeDeliveryThreshold - itemsTotal);
    const freeDeliveryProgress = Math.min(100, (itemsTotal / this.freeDeliveryThreshold) * 100);

    return {
      items: detailedItems,
      totalItemsCount,
      itemsTotal,
      originalTotal,
      productSavings,
      deliveryFee,
      handlingFee,
      couponDiscount,
      appliedCoupon,
      grandTotal,
      amountNeededForFreeDelivery,
      freeDeliveryProgress
    };
  }

  applyCouponCode(code) {
    const cleanCode = code.toUpperCase().trim();
    const bill = this.getBillDetails();

    if (cleanCode === 'KIRANA10') {
      this.saveCoupon({ code: 'KIRANA10', title: '10% Kirana Discount' });
      if (window.showToast) window.showToast("Applied KIRANA10! You got 10% off 🎉", "success");
      return true;
    } else if (cleanCode === 'WELCOME50') {
      if (bill.itemsTotal < 300) {
        if (window.showToast) window.showToast("WELCOME50 requires minimum order of ₹300", "warning");
        return false;
      }
      this.saveCoupon({ code: 'WELCOME50', title: '₹50 Flat Discount' });
      if (window.showToast) window.showToast("Applied WELCOME50! Saved flat ₹50 🎉", "success");
      return true;
    } else {
      if (window.showToast) window.showToast("Invalid coupon code! Use KIRANA10 or WELCOME50", "error");
      return false;
    }
  }

  removeCoupon() {
    this.saveCoupon(null);
    if (window.showToast) window.showToast("Coupon removed", "info");
  }

  updateCartUI() {
    const bill = this.getBillDetails();

    // Update badge numbers
    document.querySelectorAll('.cart-count-badge').forEach(badge => {
      badge.textContent = bill.totalItemsCount;
      badge.style.display = bill.totalItemsCount > 0 ? 'flex' : 'none';
    });

    document.querySelectorAll('.cart-total-price').forEach(el => {
      el.textContent = `₹${bill.grandTotal}`;
    });
  }
}

window.Cart = new CartManager();
document.addEventListener('DOMContentLoaded', () => {
  window.Cart.updateCartUI();
});
