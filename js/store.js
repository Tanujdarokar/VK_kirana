// Unified State Management & LocalStorage Store for VKCommerce

import { products as initialProducts } from './data/products.js';
import { categories } from './data/categories.js';

// LocalStorage Keys
const KEYS = {
  USER: 'vkcommerce_user',
  USERS: 'vkcommerce_registered_users',
  CART: 'vkcommerce_cart_items',
  WISHLIST: 'vkcommerce_wishlist_items',
  ORDERS: 'vkcommerce_orders',
  INVENTORY: 'vkcommerce_kirana_products',
  REQUESTS: 'vkcommerce_requested_items',
  KHATA: 'vkcommerce_kirana_khata',
  EXPENSES: 'vkcommerce_kirana_expenses',
  TRANSACTIONS: 'vkcommerce_kirana_transactions',
  COUPON: 'vkcommerce_applied_coupon'
};

// Demo Accounts
export const DEMO_VENDOR = {
  id: 'vendor_001',
  name: 'Vijay Dukan Owner',
  email: 'vendor@vkcommerce.in',
  phone: '+91 98111 22233',
  role: 'vendor',
  shopName: 'VK Kirana & Supermarket',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  address: {
    street: 'Shop No 1, Main Mandi Market, Koramangala',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560034'
  }
};

export const DEMO_USER = {
  id: 'usr_demo123',
  name: 'Tanuj Sharma',
  email: 'tanuj@example.com',
  phone: '+91 98765 43210',
  role: 'user',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  address: {
    street: 'Flat 402, Green Meadows Residency, Sector 45',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560034'
  }
};

// Initial Sample Data
const INITIAL_KHATA = [
  {
    id: 'khata-1',
    name: 'Ramesh Sharma (Gupta Ji)',
    phone: '9876543210',
    address: 'House #12, 3rd Cross',
    balance: 450,
    entries: [
      { id: 'ent-1', date: new Date(Date.now() - 4 * 86400000).toISOString(), type: 'udhaar', amount: 650, note: 'Atta 5kg + Refined Oil 1L' },
      { id: 'ent-2', date: new Date(Date.now() - 2 * 86400000).toISOString(), type: 'jama', amount: 200, note: 'Cash payment' }
    ]
  },
  {
    id: 'khata-2',
    name: 'Sunita Verma',
    phone: '9812345678',
    address: 'Flat 204, Sai Enclave',
    balance: 320,
    entries: [
      { id: 'ent-3', date: new Date(Date.now() - 3 * 86400000).toISOString(), type: 'udhaar', amount: 320, note: 'Milk 2L + Bread + Maggi 6pk' }
    ]
  },
  {
    id: 'khata-3',
    name: 'Mohan Lal Electrician',
    phone: '9899887766',
    address: 'Shop #4, Main Road',
    balance: 0,
    entries: [
      { id: 'ent-4', date: new Date(Date.now() - 5 * 86400000).toISOString(), type: 'udhaar', amount: 500, note: 'Basmati Rice 5kg' },
      { id: 'ent-5', date: new Date(Date.now() - 1 * 86400000).toISOString(), type: 'jama', amount: 500, note: 'GPay UPI cleared' }
    ]
  }
];

const INITIAL_EXPENSES = [
  { id: 'exp-1', date: new Date(Date.now() - 1 * 86400000).toISOString(), category: 'transport', amount: 150, note: 'Tempo transport fare from Mandi', paidVia: 'cash' },
  { id: 'exp-2', date: new Date(Date.now() - 2 * 86400000).toISOString(), category: 'bags', amount: 200, note: '100 pcs Grocery carry bags pack', paidVia: 'cash' },
  { id: 'exp-3', date: new Date(Date.now() - 3 * 86400000).toISOString(), category: 'tea_snacks', amount: 80, note: 'Evening tea & biscuits for helper', paidVia: 'cash' }
];

const INITIAL_ORDERS = [
  {
    id: 'VK-882194',
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    status: 'Delivered',
    deliverySlot: 'Standard Morning (7:00 AM - 10:00 AM)',
    customer: {
      name: 'Tanuj Sharma',
      email: 'tanuj@example.com',
      phone: '+91 98765 43210',
      address: {
        street: 'Flat 402, Green Meadows Residency, Sector 45',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560034'
      }
    },
    items: [
      {
        product: {
          id: 'dairy-1',
          name: 'Amul Taaza Homogenised Toned Milk',
          price: 74,
          discountPrice: 68,
          unit: '1 L (Tetra Pack)',
          image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80'
        },
        quantity: 2
      },
      {
        product: {
          id: 'rice-1',
          name: 'India Gate Royal Aged Basmati Rice',
          price: 650,
          discountPrice: 535,
          unit: '5 kg Bag',
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80'
        },
        quantity: 1
      }
    ],
    paymentMethod: 'UPI / Online Payment',
    subtotal: 671,
    deliveryFee: 0,
    handlingFee: 5,
    discount: 0,
    total: 676
  }
];

class Store {
  constructor() {
    this.listeners = [];
  }

  // Event subscription for reactive updates across components
  subscribe(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  notify(event, payload) {
    this.listeners.forEach(fn => {
      try {
        fn(event, payload);
      } catch (err) {
        console.error('Store listener error:', err);
      }
    });
  }

  // --- TOAST NOTIFICATIONS ---
  showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<span style="color:#10b981;font-size:1.2rem;">✓</span>';
    } else if (type === 'error') {
      iconSvg = '<span style="color:#ef4444;font-size:1.2rem;">✕</span>';
    } else {
      iconSvg = '<span style="color:#6366f1;font-size:1.2rem;">ℹ</span>';
    }

    toast.innerHTML = `
      ${iconSvg}
      <span style="flex:1;">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s forwards';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3200);
  }

  // --- AUTHENTICATION ---
  getUser() {
    try {
      const data = localStorage.getItem(KEYS.USER);
      return data ? JSON.parse(data) : DEMO_USER;
    } catch {
      return DEMO_USER;
    }
  }

  setUser(user) {
    if (user) {
      localStorage.setItem(KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.USER);
    }
    this.notify('auth_changed', user);
  }

  isVendor() {
    const user = this.getUser();
    return user && user.role === 'vendor';
  }

  login(email, password) {
    const cleanEmail = email.toLowerCase().trim();
    const registered = this.getRegisteredUsers();
    const found = registered.find(u => u.email.toLowerCase() === cleanEmail);

    if (found) {
      this.setUser(found);
      this.showToast(`Logged in as ${found.role === 'vendor' ? '🏪 Vendor' : '🛒 Customer'}: ${found.name}!`);
      return { success: true, user: found };
    }

    const isVendorLogin = cleanEmail === 'vendor@vkcommerce.in' || cleanEmail.includes('vendor') || cleanEmail.includes('admin') || cleanEmail.includes('shop');
    const role = isVendorLogin ? 'vendor' : 'user';

    const newUser = {
      id: 'usr_' + Date.now(),
      name: cleanEmail.split('@')[0],
      email: cleanEmail,
      phone: '+91 98765 00000',
      role,
      shopName: isVendorLogin ? 'VK Kirana & Supermarket' : undefined,
      address: {
        street: isVendorLogin ? 'Mandi Market Main Gate' : '12th Cross Road, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038'
      }
    };

    registered.push(newUser);
    localStorage.setItem(KEYS.USERS, JSON.stringify(registered));
    this.setUser(newUser);
    this.showToast(`Logged in as ${role === 'vendor' ? '🏪 Vendor' : '🛒 Customer'}: ${newUser.name}!`);
    return { success: true, user: newUser };
  }

  loginAsVendor() {
    this.setUser(DEMO_VENDOR);
    this.showToast('Switched to Vendor / Dukan Owner Account! Full Khata & POS enabled.');
    return DEMO_VENDOR;
  }

  loginAsCustomer() {
    this.setUser(DEMO_USER);
    this.showToast('Switched to Customer Account: Tanuj Sharma');
    return DEMO_USER;
  }

  register({ name, email, phone }) {
    const cleanEmail = email.toLowerCase().trim();
    const registered = this.getRegisteredUsers();

    if (registered.some(u => u.email.toLowerCase() === cleanEmail)) {
      this.showToast('Email is already registered!', 'error');
      return { success: false, message: 'Email already registered' };
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      name,
      email: cleanEmail,
      phone: phone || '+91 98765 43210',
      role: 'user',
      address: {
        street: '7th Main Road, Koramangala',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560095'
      }
    };

    registered.push(newUser);
    localStorage.setItem(KEYS.USERS, JSON.stringify(registered));
    this.setUser(newUser);
    this.showToast(`Customer account created! Welcome ${name}`);
    return { success: true, user: newUser };
  }

  logout() {
    this.setUser(null);
    this.showToast('You have logged out successfully.', 'info');
  }

  getRegisteredUsers() {
    try {
      const data = localStorage.getItem(KEYS.USERS);
      return data ? JSON.parse(data) : [DEMO_VENDOR, DEMO_USER];
    } catch {
      return [DEMO_VENDOR, DEMO_USER];
    }
  }

  updateProfile(updatedData) {
    const user = this.getUser();
    if (!user) return;
    const updated = { ...user, ...updatedData };
    this.setUser(updated);
    const registered = this.getRegisteredUsers().map(u => u.id === updated.id ? updated : u);
    localStorage.setItem(KEYS.USERS, JSON.stringify(registered));
    this.showToast('Profile updated successfully!');
  }

  // --- INVENTORY & PRODUCTS ---
  getProducts() {
    try {
      const saved = localStorage.getItem(KEYS.INVENTORY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    // Augment initial products with wholesale cost price
    const enriched = initialProducts.map(p => {
      const sellPrice = p.discountPrice || p.price;
      const costPrice = Math.round(sellPrice * (p.category === 'dairy' ? 0.90 : 0.82));
      return {
        ...p,
        costPrice: costPrice,
        minStockAlert: 5,
        unit: p.unit || '1 unit'
      };
    });

    localStorage.setItem(KEYS.INVENTORY, JSON.stringify(enriched));
    return enriched;
  }

  getProductById(id) {
    const products = this.getProducts();
    return products.find(p => p.id === id);
  }

  updateStock(productId, newStock) {
    const products = this.getProducts();
    const idx = products.findIndex(p => p.id === productId);
    if (idx > -1) {
      products[idx].stock = Math.max(0, Number(newStock));
      localStorage.setItem(KEYS.INVENTORY, JSON.stringify(products));
      this.notify('inventory_changed', products);
      this.showToast(`Updated stock for ${products[idx].name}`);
    }
  }

  addProduct(newItem) {
    const products = this.getProducts();
    const id = 'kirana-' + Date.now();
    const sellPrice = Number(newItem.discountPrice || newItem.price);
    const costPrice = Number(newItem.costPrice || Math.round(sellPrice * 0.8));
    const price = Number(newItem.price || sellPrice);
    const discount = price > sellPrice ? Math.round(((price - sellPrice) / price) * 100) : 0;

    const fullItem = {
      id,
      name: newItem.name,
      category: newItem.category || 'atta-flour-grains',
      categoryName: newItem.categoryName || 'General Grocery',
      brand: newItem.brand || 'Local Kirana',
      price,
      discountPrice: sellPrice,
      discount,
      costPrice,
      unit: newItem.unit || '1 pack',
      stock: Number(newItem.stock || 25),
      minStockAlert: Number(newItem.minStockAlert || 5),
      rating: 4.8,
      reviewsCount: 1,
      image: newItem.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
      images: [newItem.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'],
      description: newItem.description || 'Fresh item stocked directly at local VK Kirana store.',
      features: ['Local farm fresh sourcing', '100% Quality checked'],
      isPopular: false,
      isDeal: false,
      isFresh: true
    };

    products.unshift(fullItem);
    localStorage.setItem(KEYS.INVENTORY, JSON.stringify(products));
    this.notify('inventory_changed', products);
    this.showToast(`Added "${newItem.name}" to Kirana inventory!`);
    return fullItem;
  }

  deleteProduct(productId) {
    let products = this.getProducts();
    products = products.filter(p => p.id !== productId);
    localStorage.setItem(KEYS.INVENTORY, JSON.stringify(products));
    this.notify('inventory_changed', products);
    this.showToast('Item deleted from inventory.', 'info');
  }

  deductSoldStock(items) {
    const products = this.getProducts();
    items.forEach(item => {
      const idx = products.findIndex(p => p.id === (item.product?.id || item.productId));
      if (idx > -1) {
        products[idx].stock = Math.max(0, products[idx].stock - (item.quantity || 1));
      }
    });
    localStorage.setItem(KEYS.INVENTORY, JSON.stringify(products));
    this.notify('inventory_changed', products);
  }

  // --- ITEM REQUESTS ---
  getRequestedItems() {
    try {
      const data = localStorage.getItem(KEYS.REQUESTS);
      return data ? JSON.parse(data) : [
        {
          id: 'req-101',
          name: 'Fortune Kachi Ghani Mustard Oil 5L Jar',
          qty: '1 Jar',
          note: 'Urgent for family function',
          customerName: 'Harsh Verma',
          customerPhone: '+91 98765 12345',
          date: new Date(Date.now() - 86400000).toISOString(),
          status: 'Pending'
        }
      ];
    } catch {
      return [];
    }
  }

  addRequestedItem(item) {
    const list = this.getRequestedItems();
    const newReq = {
      id: 'req-' + Date.now(),
      ...item,
      date: new Date().toISOString(),
      status: 'Pending'
    };
    list.unshift(newReq);
    localStorage.setItem(KEYS.REQUESTS, JSON.stringify(list));
    this.showToast('Item request sent to Kirana Store Owner! We will arrange it soon.');
    return newReq;
  }

  // --- CART ---
  getCart() {
    try {
      const saved = localStorage.getItem(KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  saveCart(cart) {
    localStorage.setItem(KEYS.CART, JSON.stringify(cart));
    this.notify('cart_changed', cart);
  }

  addToCart(product, qty = 1) {
    const cart = this.getCart();
    const existing = cart.find(i => i.product.id === product.id);

    if (existing) {
      const newQty = existing.quantity + qty;
      if (newQty > product.stock) {
        this.showToast(`Only ${product.stock} items available in stock!`, 'error');
        return;
      }
      existing.quantity = newQty;
      this.showToast(`Updated ${product.name} quantity to ${newQty}`);
    } else {
      if (qty > product.stock) {
        this.showToast(`Only ${product.stock} items available in stock!`, 'error');
        return;
      }
      cart.push({ product, quantity: qty });
      this.showToast(`Added ${product.name} to cart!`);
    }

    this.saveCart(cart);
  }

  updateCartQty(productId, qty) {
    let cart = this.getCart();
    if (qty <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const item = cart.find(i => i.product.id === productId);
    if (item) {
      if (qty > item.product.stock) {
        this.showToast(`Only ${item.product.stock} in stock!`, 'error');
        return;
      }
      item.quantity = qty;
      this.saveCart(cart);
    }
  }

  removeFromCart(productId) {
    let cart = this.getCart();
    const item = cart.find(i => i.product.id === productId);
    cart = cart.filter(i => i.product.id !== productId);
    this.saveCart(cart);
    if (item) {
      this.showToast(`Removed ${item.product.name} from cart.`, 'info');
    }
  }

  clearCart() {
    this.saveCart([]);
  }

  getAppliedCoupon() {
    return localStorage.getItem(KEYS.COUPON) || null;
  }

  applyCoupon(code) {
    const clean = code.toUpperCase().trim();
    if (clean === 'VKFIRST100') {
      localStorage.setItem(KEYS.COUPON, 'VKFIRST100');
      this.showToast('Coupon VKFIRST100 applied! ₹100 Flat OFF');
      this.notify('cart_changed', this.getCart());
      return { success: true, discount: 100 };
    } else if (clean === 'VK50') {
      localStorage.setItem(KEYS.COUPON, 'VK50');
      this.showToast('Coupon VK50 applied! ₹50 Flat OFF');
      this.notify('cart_changed', this.getCart());
      return { success: true, discount: 50 };
    } else {
      this.showToast('Invalid promo coupon code.', 'error');
      return { success: false };
    }
  }

  removeCoupon() {
    localStorage.removeItem(KEYS.COUPON);
    this.showToast('Coupon removed.', 'info');
    this.notify('cart_changed', this.getCart());
  }

  getCartTotals() {
    const cart = this.getCart();
    const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = cart.reduce((sum, i) => {
      const price = i.product.discountPrice || i.product.price;
      return sum + price * i.quantity;
    }, 0);

    const deliveryFee = subtotal >= 499 || subtotal === 0 ? 0 : 40;
    const handlingFee = subtotal > 0 ? 5 : 0;
    
    let discount = 0;
    const coupon = this.getAppliedCoupon();
    if (coupon === 'VKFIRST100' && subtotal >= 400) discount = 100;
    else if (coupon === 'VK50' && subtotal >= 250) discount = 50;

    const grandTotal = Math.max(0, subtotal + deliveryFee + handlingFee - discount);

    return {
      totalItems,
      subtotal,
      deliveryFee,
      handlingFee,
      discount,
      grandTotal,
      freeDeliveryGap: Math.max(0, 499 - subtotal)
    };
  }

  // --- WISHLIST ---
  getWishlist() {
    try {
      const saved = localStorage.getItem(KEYS.WISHLIST);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  isInWishlist(productId) {
    const list = this.getWishlist();
    return list.some(p => p.id === productId);
  }

  toggleWishlist(product) {
    let list = this.getWishlist();
    const idx = list.findIndex(p => p.id === product.id);
    if (idx > -1) {
      list.splice(idx, 1);
      this.showToast(`Removed ${product.name} from wishlist.`, 'info');
    } else {
      list.push(product);
      this.showToast(`Added ${product.name} to wishlist! ❤️`);
    }
    localStorage.setItem(KEYS.WISHLIST, JSON.stringify(list));
    this.notify('wishlist_changed', list);
  }

  // --- ORDERS ---
  getOrders() {
    try {
      const saved = localStorage.getItem(KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  }

  getOrderById(id) {
    const orders = this.getOrders();
    return orders.find(o => o.id === id);
  }

  placeOrder(orderData) {
    const orders = this.getOrders();
    const orderId = 'VK-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      status: 'Confirmed',
      ...orderData
    };

    orders.unshift(newOrder);
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));

    // Deduct stock
    if (orderData.items) {
      this.deductSoldStock(orderData.items);
    }

    this.clearCart();
    this.removeCoupon();
    this.showToast(`Order ${orderId} placed successfully!`);
    return newOrder;
  }

  cancelOrder(id) {
    const orders = this.getOrders();
    const ord = orders.find(o => o.id === id);
    if (ord) {
      ord.status = 'Cancelled';
      localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
      this.showToast(`Order ${id} cancelled.`, 'info');
      this.notify('orders_changed', orders);
    }
  }

  // --- KHATA BOOK (DIGITAL UDHAR) ---
  getKhataCustomers() {
    try {
      const saved = localStorage.getItem(KEYS.KHATA);
      return saved ? JSON.parse(saved) : INITIAL_KHATA;
    } catch {
      return INITIAL_KHATA;
    }
  }

  addKhataCustomer({ name, phone, address }) {
    const list = this.getKhataCustomers();
    const id = 'khata-' + Date.now();
    const newCust = {
      id,
      name,
      phone,
      address: address || '',
      balance: 0,
      entries: []
    };
    list.unshift(newCust);
    localStorage.setItem(KEYS.KHATA, JSON.stringify(list));
    this.notify('khata_changed', list);
    this.showToast(`Added ${name} to Kirana Khata Book!`);
    return newCust;
  }

  addKhataEntry(customerId, { type, amount, note }) {
    const list = this.getKhataCustomers();
    const cust = list.find(c => c.id === customerId);
    if (!cust) return;

    const amt = Number(amount);
    const entry = {
      id: 'ent-' + Date.now(),
      date: new Date().toISOString(),
      type, // 'udhaar' (Gave Credit) | 'jama' (Received Payment)
      amount: amt,
      note: note || ''
    };

    cust.entries.unshift(entry);
    if (type === 'udhaar') {
      cust.balance += amt;
    } else {
      cust.balance = Math.max(0, cust.balance - amt);
    }

    localStorage.setItem(KEYS.KHATA, JSON.stringify(list));
    this.notify('khata_changed', list);
    this.showToast(`Recorded ₹${amt} ${type === 'udhaar' ? 'Udhaar' : 'Jama'} for ${cust.name}!`);
    return cust;
  }

  // --- SHOP EXPENSES ---
  getExpenses() {
    try {
      const saved = localStorage.getItem(KEYS.EXPENSES);
      return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
    } catch {
      return INITIAL_EXPENSES;
    }
  }

  addExpense({ category, amount, note, paidVia = 'cash' }) {
    const list = this.getExpenses();
    const newExp = {
      id: 'exp-' + Date.now(),
      date: new Date().toISOString(),
      category,
      amount: Number(amount),
      note: note || '',
      paidVia
    };
    list.unshift(newExp);
    localStorage.setItem(KEYS.EXPENSES, JSON.stringify(list));
    this.notify('expenses_changed', list);
    this.showToast(`Recorded shop expense: ₹${amount}`);
    return newExp;
  }

  deleteExpense(id) {
    let list = this.getExpenses();
    list = list.filter(e => e.id !== id);
    localStorage.setItem(KEYS.EXPENSES, JSON.stringify(list));
    this.notify('expenses_changed', list);
    this.showToast('Expense entry deleted.', 'info');
  }

  // --- POS BILLING TRANSACTIONS ---
  getTransactions() {
    try {
      const saved = localStorage.getItem(KEYS.TRANSACTIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  recordPosSale({ customerName, items, subtotal, cost, profit, paymentMethod, amountPaid, changeReturned }) {
    const list = this.getTransactions();
    const txn = {
      id: 'TXN-' + Math.floor(100 + Math.random() * 900),
      date: new Date().toISOString(),
      type: 'pos',
      customerName: customerName || 'Walk-in Customer',
      items,
      subtotal,
      cost,
      profit,
      paymentMethod,
      amountPaid,
      changeReturned
    };

    list.unshift(txn);
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(list));
    this.deductSoldStock(items);
    this.notify('transactions_changed', list);
    this.showToast(`Counter Bill ${txn.id} created successfully! Total: ₹${subtotal}`);
    return txn;
  }
}

export const store = new Store();
