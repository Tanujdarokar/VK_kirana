# VKCommerce - Kirana & Supermarket

A modern, high-performance grocery and local kirana store web application built using **pure HTML5, CSS3, and Vanilla JavaScript (ES Modules)**.

The project includes an interactive customer storefront, product catalog with dynamic filtering and live auto-complete search, cart, checkout flow with UPI/COD, order tracking, customer authentication, along with a complete Kirana Store Management suite (Admin Dashboard, POS Billing Counter, Stock Inventory Manager, Digital Khata Book, and Shop Expense Tracker).

---

## 🌟 Tech Stack

- **Core**: Vanilla HTML5, CSS3, and Modern JavaScript (ES Modules)
- **Styling**: Tailored CSS design system with CSS custom properties, glassmorphism, responsive grid layouts, and micro-animations
- **State Management**: Centralized unified store (`js/store.js`) backed by browser `localStorage`
- **NLP Grocery Assistant**: Hinglish conversational parser (`js/data/aiAssistant.js` & `js/ai-widget.js`)
- **Dev Server**: Vite (for fast local development and multi-page preview)

---

## 📁 Project Structure

```text
VKCommerce/
├── index.html                   # Storefront Homepage
├── products.html                # Product Catalog with Search, Category & Price Filters
├── category.html                # Category Browsing View
├── product-details.html         # Product Specifications & Nutrition
├── cart.html                    # Shopping Bag with Coupon Promo & Free Delivery Meter
├── checkout.html                # Express 15-Min Delivery & Payment (UPI/COD)
├── order-success.html           # Order Confirmed + Live 15-Minute Delivery Tracker
├── orders.html                  # Customer Past Orders & Reorder
├── wishlist.html                # Saved Wishlist Items
├── profile.html                 # Customer Account Profile & Role Switcher
├── login.html                   # Login with 1-Click Demo Customer & Vendor Buttons
├── register.html                # Customer Registration
├── admin.html                   # Dukan Business Dashboard & Metrics
├── admin-pos.html               # Express POS Billing Counter & Thermal Receipt Printer
├── admin-inventory.html         # Live Inventory Stock & Price Margin Manager
├── admin-khata.html             # Digital Udhar / Khata Book with WhatsApp Reminders
├── admin-expenses.html          # Shop Daily Expenses & P&L Overhead Tracker
├── css/
│   ├── style.css                # Core design system, utilities, cards, typography
│   └── admin.css                # Admin, POS Counter, Khata, and Expenses styles
├── js/
│   ├── data/
│   │   ├── products.js          # 80+ Grocery products with images, prices, units
│   │   ├── categories.js        # 10 Kirana categories with banners & colors
│   │   └── aiAssistant.js       # Hinglish voice/text parser & grocery aliases
│   ├── store.js                 # Unified state store (Auth, Cart, Inventory, Khata, Expenses)
│   ├── common.js                # Shared navbar, footer, modals, toasts, product cards
│   ├── ai-widget.js             # Kirana AI Assistant floating widget
│   ├── admin-common.js          # Shared admin navigation and vendor security guard
│   └── pages/                   # Page-specific controllers
│       ├── home.js
│       ├── products.js
│       ├── category.js
│       ├── product-details.js
│       ├── cart.js
│       ├── checkout.js
│       ├── order-success.js
│       ├── orders.js
│       ├── wishlist.js
│       ├── profile.js
│       ├── auth.js
│       ├── admin-dashboard.js
│       ├── admin-pos.js
│       ├── admin-inventory.js
│       ├── admin-khata.js
│       └── admin-expenses.js
├── public/
│   └── favicon.svg              # Store favicon icon
├── package.json
└── vite.config.js
```

---

## 🚀 Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

3. **Build for Production**:
   ```bash
   npm run build
   ```
   The optimized multi-page output will be generated inside the `dist/` directory.

4. **Direct Browser / Static Hosting**:
   The website can also be opened directly via `index.html` or deployed to any static web hosting service (GitHub Pages, Vercel, Netlify, Apache, Nginx, or cPanel).
