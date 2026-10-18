# VKCommerce - Kirana & Supermarket

A grocery storefront and kirana management **demo** built using HTML5, CSS3, and Vanilla JavaScript (ES Modules).

The project includes a storefront, product catalog, demo cart and checkout flow, local demo profiles, and a browser-only shop management suite (dashboard, POS, inventory, khata, and expenses). It does not process real orders or payments.

---

## 🌟 Tech Stack

- **Core**: Static HTML5, CSS3, and browser-native JavaScript modules
- **Styling**: Tailored CSS design system with CSS custom properties, glassmorphism, responsive grid layouts, and micro-animations
- **State Management**: Centralized demo store (`js/store.js`) backed by browser `localStorage`
- **Search**: Hinglish grocery search aliases (`js/data/searchAliases.js`)
- **Hosting**: Static hosting (GitHub Pages or any host that serves HTML, CSS, JavaScript modules, and static assets)

---

## Project structure

```text
VKCommerce/
├── .github/
│   └── workflows/
│       └── deploy.yml           # Publish static files to GitHub Pages
├── .gitignore
├── 404.html                     # Custom not-found page
├── admin-expenses.html
├── admin-inventory.html
├── admin-khata.html
├── admin-pos.html
├── admin.html                   # Store dashboard
├── cart.html
├── category.html
├── checkout.html                # Demo checkout
├── favicon.svg
├── index.html                   # Storefront homepage
├── login.html                   # Demo customer/vendor profile entry
├── order-success.html
├── orders.html
├── privacy.html
├── product-details.html
├── products.html
├── profile.html
├── README.md
├── register.html                # Create a browser-only demo profile
├── robots.txt
├── sitemap.xml
├── social-preview.png
├── terms.html
├── wishlist.html
├── css/
│   ├── admin.css
│   └── style.css
└── js/
    ├── admin-common.js          # Shared admin layout and demo UI guard
    ├── common.js                # Shared navigation, footer, modals, and cards
    ├── store.js                 # Browser-local demo state
    ├── data/
    │   ├── categories.js
    │   ├── products.js
    │   └── searchAliases.js
    └── pages/
        ├── admin-dashboard.js
        ├── admin-expenses.js
        ├── admin-inventory.js
        ├── admin-khata.js
        ├── admin-pos.js
        ├── auth.js
        ├── cart.js
        ├── category.js
        ├── checkout.js
        ├── home.js
        ├── legal.js
        ├── order-success.js
        ├── orders.js
        ├── product-details.js
        ├── products.js
        ├── profile.js
        └── wishlist.js
```

---

## Running locally

Serve the repository root with any static web server. For example, with Python installed:
   ```bash
   python -m http.server 8000
   ```
Then open `http://localhost:8000`. Serving over HTTP is required for browser-native JavaScript modules; opening the HTML files directly with `file://` may block module imports.

Deploy the repository's HTML pages, `css/`, `js/`, and root static assets to a static host. The GitHub Pages workflow publishes these files directly without a package manager, bundler, or build step. The sitemap and canonical URLs currently use `https://tanujdarokar.github.io/VK_kirana/`; update them if the production domain or repository path changes.

For GitHub Pages, open **Settings → Pages** and enable **Enforce HTTPS** after the site is published. Repository files cannot enable that hosting setting by themselves.

## Demo security and production requirements

This repository is frontend-only. Demo profiles, inventory, orders, and shop records live in editable browser storage; the admin guard is a UI convenience, not authorization. The demo intentionally does not collect passwords. Do not use real customer, payment, or business data.

There are no application APIs, SQL queries, webhook handlers, upload endpoints, or configured analytics provider in this project. Accordingly, API authorization, row-level security, webhook signature checks, private object storage, server-side file validation, rate limiting, audit logs, strong CORS policy, and server response security headers cannot be implemented in static HTML/CSS/JavaScript. Do not put secrets in frontend code. A production store needs a trusted backend that authenticates every request, authorizes each resource access, validates data independently of the browser, and enforces these controls at the server and storage layers.

The cookie preference UI remembers an optional analytics choice, but no analytics provider is configured or loaded. Analytics setup is pending a provider and account/site identifier; do not collect analytics until the integration is configured and consent-gated. The privacy and terms pages are demo templates and must be reviewed for the real operator, jurisdiction, and processing practices before launch.
