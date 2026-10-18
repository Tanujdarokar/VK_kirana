import { resolve } from 'path';
import { defineConfig } from 'vite';

const rootDir = import.meta.dirname;

// Pure HTML, CSS, JavaScript Multi-Page Web Architecture
export default defineConfig({
  base: './',
  server: {
    port: 5173,
    open: true
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(rootDir, 'index.html'),
        products: resolve(rootDir, 'products.html'),
        category: resolve(rootDir, 'category.html'),
        productDetails: resolve(rootDir, 'product-details.html'),
        cart: resolve(rootDir, 'cart.html'),
        checkout: resolve(rootDir, 'checkout.html'),
        orderSuccess: resolve(rootDir, 'order-success.html'),
        orders: resolve(rootDir, 'orders.html'),
        wishlist: resolve(rootDir, 'wishlist.html'),
        profile: resolve(rootDir, 'profile.html'),
        login: resolve(rootDir, 'login.html'),
        register: resolve(rootDir, 'register.html'),
        admin: resolve(rootDir, 'admin.html'),
        adminPos: resolve(rootDir, 'admin-pos.html'),
        adminInventory: resolve(rootDir, 'admin-inventory.html'),
        adminKhata: resolve(rootDir, 'admin-khata.html'),
        adminExpenses: resolve(rootDir, 'admin-expenses.html')
      }
    }
  }
});
