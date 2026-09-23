# VKCommerce

A modern React + Vite grocery and kirana store application built for both customer shopping and store-owner management. The project includes a storefront, product browsing, cart and checkout flow, wishlist, orders, user authentication screens, and an admin dashboard for inventory, billing, khata records, and expense tracking.

## Overview

VKCommerce is designed as a local kirana-style ecommerce app with a business-management layer for shop owners. It combines a customer-facing online store with admin tools for operating a small retail business.

## Features

### Customer experience
- Product catalog and category browsing
- Product detail pages with quick view support
- Wishlist and cart management
- Checkout flow and order confirmation
- Order history and user profile
- Login, registration, and forgot-password screens
- Responsive layout with navbar and footer
- AI assistant floating button for support/help

### Store-owner tools
- Admin dashboard
- Inventory management page
- POS billing interface
- Khata book tracking
- Expense tracker
- Business overview cards and stats

## Tech stack

- React 19
- Vite
- React Router DOM
- Lucide React icons
- Canvas Confetti for celebratory UI effects

## Project structure

```text
VKCommerce/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── admin/
│   │   ├── ai/
│   │   ├── common/
│   │   ├── layout/
│   │   └── product/
│   ├── context/
│   ├── data/
│   ├── pages/
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   └── App.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Prerequisites

Before running the project, make sure you have:

- Node.js installed
- npm or another package manager available

## Installation

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Then open the local Vite URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Production build

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Notes

- This project currently uses local mock/demo data for products, categories, orders, and admin metrics.
- It is a frontend-focused application and does not include a backend or database yet.
- The app is structured for easy extension into a full ecommerce + ERP flow with API integration later.

## License

This project is for educational and demo purposes.
