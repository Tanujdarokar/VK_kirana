# Apni Kirana (अपनी किराना) – Online Grocery Shopping Website

> **"Aapki Apni Dukan, Ab Online!"**

A complete, modern, professional, responsive Indian Kirana Store website built using **HTML5, CSS3, and Vanilla JavaScript**. Represents a real Indian local grocery shop (*Kirana Dukan*), allowing customers to browse 50+ fresh grocery staples, add items to cart, switch between **English & Hindi (हिंदी)**, checkout via Cash on Delivery or UPI, track order progress, and manage shop inventory as a Dukan Owner.

---

## 🌟 Key Features

### 1. 🌐 Bilingual Support (English & Hindi)
- Live language switcher in top navbar (`English` | `हिंदी`).
- Authentic Kirana Terminology:
  - **Anaj (अनाज)** – Rice & Wheat
  - **Daal (दाल)** – Dal & Pulses
  - **Tel (तेल)** – Cooking Oil & Ghee
  - **Doodh (दूध)** – Dairy Products
  - **Masale (मसाले)** – Spices & Masala
  - **Naashta (नाश्ता)** – Snacks & Biscuits
- Automatically updates product names, category cards, navigation, and shopping messages on language change!

### 2. 🛒 Shopping Cart & LocalStorage Engine
- Add/remove items with live cart quantity counter.
- Automatic Subtotal, Savings, Delivery Charge (Free above ₹499), and Handling Fee calculation.
- Apply discount coupons (`KIRANA10` for 10% OFF, `WELCOME50` for flat ₹50 OFF).
- Full LocalStorage persistence across browser refreshes.

### 3. 📦 Checkout & Cash on Delivery / UPI
- Address validation (10-digit mobile number, 6-digit Indian Pincode).
- Payment options: **Cash on Delivery (COD)**, **UPI QR**, and Online demo interface.
- Instant unique Order ID generation (`AK-XXXXXX`).

### 4. 🚚 Real-Time Order Tracking
- Interactive progress timeline:
  1. **Order Placed** $\rightarrow$ 2. **Order Confirmed** $\rightarrow$ 3. **Packing in Kirana** $\rightarrow$ 4. **Out for Delivery** $\rightarrow$ 5. **Delivered**

### 5. 🏪 Dukan Owner Admin Dashboard (`admin.html`)
- Store metrics: Total Products, Total Orders, Sales Revenue (₹), Low Stock Alerts.
- Product CRUD: Add new items, update prices & stock, delete products.
- Order Status Manager: Live status updates for customer orders.

### 6. 🎨 Responsive Indian E-Commerce Design
- **Color Palette**: Fresh Green (`#168447`), Light Green (`#E8F5E9`), Dark Grey (`#252525`), Accent Orange (`#FF9800`).
- **Dark Mode**: Toggle between Light and Dark mode.
- **WhatsApp Order Enquiry**: Direct WhatsApp chat integration with storekeeper.

---

## 📂 Project Structure

```
apni-kirana/
├── index.html            # Homepage
├── shop.html             # Product Catalog & Category Filters
├── products.html         # Redirect to shop.html
├── product-details.html  # Product Details View
├── cart.html             # Shopping Cart & Bill Summary
├── checkout.html         # Customer Address & Payment Checkout
├── order-success.html    # Order Confirmation
├── track-order.html      # Order Tracking Timeline
├── login.html            # Customer & Vendor Login
├── register.html         # Account Registration
├── profile.html          # Profile & Saved Addresses
├── orders.html           # My Orders History
├── admin.html            # Dukan Owner Admin Dashboard
│
├── css/
│   ├── style.css         # Global Theme Variables & Component Styles
│   ├── responsive.css    # Mobile, Tablet & Desktop Queries
│   ├── shop.css          # Product & Category Cards
│   ├── cart.css          # Cart Layout & Tracking Timeline
│   └── admin.css         # Admin Metrics & Tables
│
└── js/
    ├── language.js       # Multilingual Dictionary & Switcher Engine
    ├── products.js       # 50+ Realistic Indian Grocery Database
    ├── cart.js           # Cart Engine, Coupons & Bill Calculation
    ├── checkout.js       # Order Placement & Address Validation
    ├── auth.js           # User Session & Demo Login Manager
    ├── orders.js         # Order Status Timeline Renderer
    ├── admin.js          # Admin Dashboard & Inventory CRUD
    └── main.js           # Global Search Suggestions, Toasts & Theme
```

---

## 🚀 How to Run using VS Code Live Server

1. **Clone or Download the Repository**:
   ```bash
   git clone https://github.com/tanujdarokar/VK_kirana.git
   cd VK_kirana
   ```

2. **Open in VS Code**:
   Launch Visual Studio Code and open the project directory.

3. **Install Live Server Extension**:
   - Go to Extensions (`Ctrl+Shift+X` or `Cmd+Shift+X`).
   - Search for **Live Server** by Ritwick Dey and click **Install**.

4. **Start the Web Application**:
   - Right-click `index.html` in the file explorer.
   - Click **Open with Live Server**.
   - Your browser will open `http://127.0.0.1:5500/index.html`.

---

## 👥 Demo Credentials

- **Customer Demo**: `harsh@example.com`
- **Vendor / Dukan Owner Demo**: `vendor@apnikirana.in`

---

## 📜 License & Portfolio Usage
This project is built for portfolio showcases, GitHub repositories, and deployment on **Vercel / GitHub Pages**. All rights reserved © 2025 **Apni Kirana**.
