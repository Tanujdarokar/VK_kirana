// VKCommerce Common Shell: Header Navbar, Modals, Footer, Icons & Utilities

import { store } from './store.js';
import { categories } from './data/categories.js';
import { getExpandedSearchTerms } from './data/aiAssistant.js';

export function initCommonUI() {
  renderNavbar();
  renderFooter();
  renderModals();
  setupEventListeners();
  updateBadges();

  store.subscribe((event) => {
    if (event === 'cart_changed' || event === 'wishlist_changed' || event === 'auth_changed') {
      updateBadges();
      updateUserMenuUI();
    }
  });

  // Re-render Lucide icons if available
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function updateBadges() {
  const { totalItems } = store.getCartTotals();
  const wishlist = store.getWishlist();

  const cartBadges = document.querySelectorAll('.cart-count-badge');
  cartBadges.forEach(b => {
    b.textContent = totalItems;
    b.style.display = totalItems > 0 ? 'flex' : 'none';
  });

  const wishlistBadges = document.querySelectorAll('.wishlist-count-badge');
  wishlistBadges.forEach(b => {
    b.textContent = wishlist.length;
    b.style.display = wishlist.length > 0 ? 'flex' : 'none';
  });
}

function updateUserMenuUI() {
  const user = store.getUser();
  const userBtnText = document.getElementById('navbar-user-name');
  if (userBtnText) {
    userBtnText.textContent = user ? user.name.split(' ')[0] : 'Sign In';
  }

  const vendorTag = document.getElementById('navbar-vendor-badge');
  if (vendorTag) {
    vendorTag.style.display = user && user.role === 'vendor' ? 'inline-block' : 'none';
  }

  const adminLink = document.getElementById('navbar-admin-link');
  if (adminLink) {
    adminLink.style.display = user && user.role === 'vendor' ? 'flex' : 'none';
  }
}

function renderNavbar() {
  const navContainer = document.getElementById('vk-navbar-container');
  if (!navContainer) return;

  const user = store.getUser();
  const isVendor = user && user.role === 'vendor';

  navContainer.innerHTML = `
    <!-- Top Announcement Ticker -->
    <div style="background: linear-gradient(90deg, #064e3b 0%, #047857 50%, #065f46 100%); color: #ecfdf5; font-size: 0.8rem; font-weight: 600; padding: 7px 0; text-align: center;">
      <div class="container" style="display: flex; align-items: center; justify-content: center; gap: 16px; flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="color:#facc15;">⚡</span>
          <span>Express 15-Min Local Kirana Delivery in Bengaluru</span>
        </div>
        <span style="opacity: 0.5;">•</span>
        <div class="hide-on-mobile">100% Shuddh & Taaza Daily Essentials • Wholesale Rates</div>
        <span class="hide-on-mobile" style="opacity: 0.5;">•</span>
        <div style="display: flex; align-items: center; gap: 4px;">
          <span style="color:#34d399;">🛡️</span>
          <span>Cash on Delivery (COD) & UPI Accepted</span>
        </div>
      </div>
    </div>

    <!-- Main Navigation Bar -->
    <header style="background: rgba(255, 255, 255, 0.96); backdrop-filter: blur(12px); border-bottom: 1px solid #e2e8f0; position: sticky; top: 0; z-index: 100; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
      <div class="container" style="padding: 12px 1.25rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px;">
          
          <!-- Logo & Mobile Menu Toggle -->
          <div style="display: flex; align-items: center; gap: 14px;">
            <button class="btn-icon mobile-menu-toggle show-on-mobile" style="display: none;" id="open-mobile-menu-btn" aria-label="Menu">
              <i data-lucide="menu"></i>
            </button>

            <a href="index.html" style="display: flex; align-items: center; gap: 10px; text-decoration: none;">
              <div style="width: 42px; height: 42px; border-radius: 12px; background: linear-gradient(135deg, #059669 0%, #047857 100%); display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 6px 14px rgba(5, 150, 105, 0.35);">
                <i data-lucide="shopping-bag" style="width: 22px; height: 22px;"></i>
              </div>
              <div>
                <div style="font-size: 1.4rem; font-weight: 900; color: #0f172a; letter-spacing: -0.03em; line-height: 1;">
                  VK<span style="color: #059669;">Kirana</span>
                </div>
                <div style="font-size: 0.65rem; font-weight: 800; color: #047857; letter-spacing: 0.06em; text-transform: uppercase;">
                  Apni Local Dukan 🛒
                </div>
              </div>
            </a>
          </div>

          <!-- Live Search Bar -->
          <div style="flex: 1; max-width: 520px; position: relative;">
            <form id="global-search-form" action="products.html" method="GET">
              <div style="position: relative; display: flex; align-items: center;">
                <i data-lucide="search" style="position: absolute; left: 14px; width: 18px; height: 18px; color: #94a3b8; pointer-events: none;"></i>
                <input
                  type="text"
                  name="search"
                  id="global-search-input"
                  placeholder="Search 'atta', 'toor dal', 'amul milk', 'fortune tel'..."
                  autocomplete="off"
                  style="width: 100%; padding: 11px 40px 11px 42px; border-radius: 12px; background-color: #f1f5f9; border: 1px solid transparent; font-size: 0.9rem; color: #0f172a;"
                />
              </div>
            </form>
            <div id="search-dropdown-results" style="display: none; position: absolute; top: calc(100% + 6px); left: 0; right: 0; background: white; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; z-index: 200; overflow: hidden;"></div>
          </div>

          <!-- Right Action Buttons -->
          <div style="display: flex; align-items: center; gap: 10px;">
            <!-- Location Selector -->
            <button class="btn btn-outline hide-on-mobile" id="open-location-modal-btn" style="padding: 7px 12px; font-size: 0.85rem; border-radius: 10px;">
              <i data-lucide="map-pin" style="width: 16px; height: 16px; color: #059669;"></i>
              <span id="selected-location-label" style="max-width: 130px; overflow: hidden; text-overflow: ellipsis;">Koramangala, BLR</span>
            </button>

            <!-- Item Request Button -->
            <button class="btn btn-secondary hide-on-mobile" id="open-request-modal-btn" style="padding: 7px 12px; font-size: 0.85rem; border-radius: 10px;">
              <i data-lucide="package-plus" style="width: 16px; height: 16px; color: #059669;"></i>
              <span>Request Item</span>
            </button>

            <!-- Admin Shortcut (If Vendor) -->
            <a href="admin.html" id="navbar-admin-link" class="btn btn-primary" style="display: ${isVendor ? 'flex' : 'none'}; padding: 7px 12px; font-size: 0.85rem; background: #0f172a; border-color: #1e293b; border-radius: 10px;">
              <i data-lucide="layout-dashboard" style="width: 16px; height: 16px; color: #34d399;"></i>
              <span>Dukan Admin</span>
            </a>

            <!-- Wishlist Button -->
            <a href="wishlist.html" class="btn-icon" style="position: relative;" aria-label="Wishlist">
              <i data-lucide="heart" style="width: 20px; height: 20px;"></i>
              <span class="wishlist-count-badge" style="display: none; position: absolute; top: -4px; right: -4px; background: #ef4444; color: white; font-size: 0.7rem; font-weight: 800; width: 18px; height: 18px; border-radius: 50%; align-items: center; justify-content: center;">0</span>
            </a>

            <!-- Cart Button -->
            <a href="cart.html" class="btn btn-primary" style="padding: 8px 16px; border-radius: 12px; position: relative;" aria-label="Cart">
              <i data-lucide="shopping-cart" style="width: 18px; height: 18px;"></i>
              <span class="hide-on-mobile">Cart</span>
              <span class="cart-count-badge" style="display: none; position: absolute; top: -6px; right: -6px; background: #0f172a; color: #34d399; font-size: 0.72rem; font-weight: 800; width: 22px; height: 22px; border-radius: 50%; border: 2px solid white; align-items: center; justify-content: center;">0</span>
            </a>

            <!-- User Menu Button -->
            <div style="position: relative;" id="user-menu-wrapper">
              <button class="btn btn-outline" id="user-menu-btn" style="padding: 7px 12px; border-radius: 10px; display: flex; align-items: center; gap: 8px;">
                <div style="width: 26px; height: 26px; border-radius: 50%; background: #059669; color: white; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 800;">
                  ${user ? user.name.charAt(0) : 'U'}
                </div>
                <span id="navbar-user-name" class="hide-on-mobile" style="font-size: 0.85rem; font-weight: 700;">
                  ${user ? user.name.split(' ')[0] : 'Account'}
                </span>
                <i data-lucide="chevron-down" style="width: 14px; height: 14px; color: #64748b;"></i>
              </button>

              <!-- Dropdown Menu -->
              <div id="user-dropdown-menu" style="display: none; position: absolute; top: calc(100% + 8px); right: 0; width: 250px; background: white; border-radius: 14px; box-shadow: 0 10px 25px rgba(0,0,0,0.12); border: 1px solid #e2e8f0; padding: 8px; z-index: 200;">
                <div style="padding: 8px 12px; border-bottom: 1px solid #f1f5f9; margin-bottom: 6px;">
                  <div style="font-weight: 800; color: #0f172a; font-size: 0.9rem;">${user ? user.name : 'Guest User'}</div>
                  <div style="font-size: 0.78rem; color: #64748b;">${user ? user.email : 'Not signed in'}</div>
                  <span id="navbar-vendor-badge" style="display: ${isVendor ? 'inline-block' : 'none'}; font-size: 0.7rem; font-weight: 800; color: #059669; background: #ecfdf5; padding: 2px 8px; border-radius: 10px; margin-top: 4px;">🏪 Store Owner</span>
                </div>

                <a href="profile.html" class="dropdown-item" style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 8px; color: #334155; font-size: 0.88rem; font-weight: 600; text-decoration: none;">
                  <i data-lucide="user" style="width: 16px; height: 16px;"></i> My Profile
                </a>
                <a href="orders.html" class="dropdown-item" style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 8px; color: #334155; font-size: 0.88rem; font-weight: 600; text-decoration: none;">
                  <i data-lucide="package" style="width: 16px; height: 16px;"></i> My Orders
                </a>
                
                <div style="border-top: 1px solid #f1f5f9; margin: 6px 0; padding-top: 6px;">
                  <div style="font-size: 0.72rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; padding: 4px 12px;">Quick Role Switch</div>
                  <button id="switch-to-customer-btn" style="width: 100%; text-align: left; display: flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 6px; font-size: 0.82rem; color: #0f172a; font-weight: 600;">
                    🛒 Switch to Customer
                  </button>
                  <button id="switch-to-vendor-btn" style="width: 100%; text-align: left; display: flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 6px; font-size: 0.82rem; color: #059669; font-weight: 700;">
                    🏪 Switch to Dukan Owner (Admin)
                  </button>
                </div>

                <div style="border-top: 1px solid #f1f5f9; margin-top: 6px; padding-top: 6px;">
                  ${user ? `
                    <button id="nav-logout-btn" style="width: 100%; text-align: left; display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 8px; color: #ef4444; font-size: 0.85rem; font-weight: 600;">
                      <i data-lucide="log-out" style="width: 16px; height: 16px;"></i> Sign Out
                    </button>
                  ` : `
                    <a href="login.html" class="dropdown-item" style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 8px; color: #059669; font-size: 0.88rem; font-weight: 700; text-decoration: none;">
                      <i data-lucide="log-in" style="width: 16px; height: 16px;"></i> Sign In / Register
                    </a>
                  `}
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Quick Categories Strip -->
        <div class="hide-on-mobile" style="display: flex; align-items: center; gap: 20px; overflow-x: auto; padding-top: 10px; margin-top: 10px; border-top: 1px solid #f1f5f9; font-size: 0.86rem; font-weight: 600; color: #475569;">
          <a href="products.html" style="color: #059669; font-weight: 700; white-space: nowrap;">⚡ All Groceries</a>
          ${categories.slice(0, 8).map(c => `
            <a href="category.html?category=${c.slug}" style="white-space: nowrap; transition: color 0.2s;" onmouseover="this.style.color='#059669'" onmouseout="this.style.color='#475569'">
              ${c.name}
            </a>
          `).join('')}
        </div>
      </div>
    </header>

    <!-- Mobile Navigation Drawer -->
    <div id="mobile-menu-drawer" style="display: none; position: fixed; inset: 0; z-index: 1000; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px);">
      <div style="width: 300px; height: 100%; background: white; padding: 20px; display: flex; flex-direction: column; overflow-y: auto;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">
          <div style="font-weight: 900; font-size: 1.2rem; color: #0f172a;">VKKirana Menu</div>
          <button id="close-mobile-menu-btn" class="btn-icon"><i data-lucide="x"></i></button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px; font-weight: 600;">
          <a href="index.html" class="btn btn-outline" style="justify-content: flex-start;"><i data-lucide="home"></i> Home</a>
          <a href="products.html" class="btn btn-outline" style="justify-content: flex-start;"><i data-lucide="shopping-bag"></i> All Products</a>
          <a href="cart.html" class="btn btn-outline" style="justify-content: flex-start;"><i data-lucide="shopping-cart"></i> Cart</a>
          <a href="orders.html" class="btn btn-outline" style="justify-content: flex-start;"><i data-lucide="package"></i> Orders</a>
          <a href="wishlist.html" class="btn btn-outline" style="justify-content: flex-start;"><i data-lucide="heart"></i> Wishlist</a>
          <a href="admin.html" class="btn btn-primary" style="justify-content: flex-start; background: #0f172a;"><i data-lucide="store"></i> Dukan Admin / POS</a>
        </div>

        <div style="margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
          <div style="font-size: 0.8rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 10px;">Categories</div>
          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.9rem;">
            ${categories.map(c => `<a href="category.html?category=${c.slug}" style="color: #334155;">${c.name}</a>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderFooter() {
  const footerContainer = document.getElementById('vk-footer-container');
  if (!footerContainer) return;

  footerContainer.innerHTML = `
    <footer style="background-color: #0f172a; color: #e2e8f0; padding: 60px 0 24px; margin-top: auto; border-top: 4px solid #059669;">
      <div class="container">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 3rem; margin-bottom: 3rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
              <div style="width: 38px; height: 38px; border-radius: 10px; background: #059669; display: flex; align-items: center; justify-content: center; color: white;">
                <i data-lucide="shopping-bag"></i>
              </div>
              <span style="font-size: 1.4rem; font-weight: 900; color: white;">VK<span style="color: #34d399;">Kirana</span></span>
            </div>
            <p style="color: #94a3b8; font-size: 0.9rem; line-height: 1.6; margin-bottom: 16px;">
              Bengaluru's favorite neighborhood kirana store. Delivering pure dairy, fresh staples, pulses, oil, spices, and household essentials in 15 minutes.
            </p>
            <div style="display: flex; gap: 10px;">
              <span style="background: #1e293b; padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; color: #34d399; font-weight: 700;">⚡ 15-Min Delivery</span>
              <span style="background: #1e293b; padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; color: #34d399; font-weight: 700;">💵 COD Available</span>
            </div>
          </div>

          <div>
            <h4 style="color: white; font-size: 1.1rem; margin-bottom: 16px;">Top Categories</h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 0.9rem; color: #94a3b8;">
              <li><a href="category.html?category=atta-flour-grains" style="transition: color 0.2s;" onmouseover="this.style.color='#34d399'" onmouseout="this.style.color='#94a3b8'">Atta, Flour & Grains</a></li>
              <li><a href="category.html?category=dal-pulses" style="transition: color 0.2s;" onmouseover="this.style.color='#34d399'" onmouseout="this.style.color='#94a3b8'">Dal & Pulses</a></li>
              <li><a href="category.html?category=cooking-oil-ghee" style="transition: color 0.2s;" onmouseover="this.style.color='#34d399'" onmouseout="this.style.color='#94a3b8'">Cooking Oil & Desi Ghee</a></li>
              <li><a href="category.html?category=dairy-breakfast" style="transition: color 0.2s;" onmouseover="this.style.color='#34d399'" onmouseout="this.style.color='#94a3b8'">Dairy & Breakfast</a></li>
              <li><a href="category.html?category=masala-spices" style="transition: color 0.2s;" onmouseover="this.style.color='#34d399'" onmouseout="this.style.color='#94a3b8'">Masala & Indian Spices</a></li>
            </ul>
          </div>

          <div>
            <h4 style="color: white; font-size: 1.1rem; margin-bottom: 16px;">Quick Links</h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 0.9rem; color: #94a3b8;">
              <li><a href="products.html">All Products Catalog</a></li>
              <li><a href="cart.html">My Shopping Cart</a></li>
              <li><a href="orders.html">Track Orders</a></li>
              <li><a href="admin.html">Dukan Owner Admin Portal</a></li>
              <li><a href="login.html">Sign In / Switch Accounts</a></li>
            </ul>
          </div>

          <div>
            <h4 style="color: white; font-size: 1.1rem; margin-bottom: 16px;">Dukan Address & Help</h4>
            <p style="color: #94a3b8; font-size: 0.9rem; line-height: 1.6; margin-bottom: 10px;">
              📍 Shop No. 1, Main Mandi Market, 7th Cross, Koramangala, Bengaluru, KA 560034
            </p>
            <p style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 10px;">
              📞 Helpline: +91 98765 43210 (7 AM - 11 PM)
            </p>
            <p style="color: #34d399; font-size: 0.9rem; font-weight: 700;">
              WhatsApp Kirana Order: +91 98111 22233
            </p>
          </div>
        </div>

        <div style="border-top: 1px solid #1e293b; padding-top: 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; font-size: 0.85rem; color: #64748b;">
          <div>© 2026 VKCommerce & Kirana Supermarket. Pure HTML, CSS, JavaScript Architecture.</div>
          <div style="display: flex; gap: 20px;">
            <span>Safe & Secure UPI / Card Checkout</span>
            <span>100% Genuine Brands Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  `;
}

function renderModals() {
  const modalWrapper = document.createElement('div');
  modalWrapper.id = 'common-modals-wrapper';
  modalWrapper.innerHTML = `
    <!-- Location Picker Modal -->
    <div id="location-modal" class="modal-backdrop" style="display: none;">
      <div class="modal-card" style="max-width: 460px; padding: 24px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <h3 style="font-size: 1.25rem;">Select Delivery Location</h3>
          <button id="close-location-modal-btn" class="btn-icon"><i data-lucide="x"></i></button>
        </div>
        <p style="color: #64748b; font-size: 0.88rem; margin-bottom: 16px;">
          Choose your Bengaluru locality for instant 15-minute express grocery delivery:
        </p>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${['Koramangala 4th Block, BLR', 'Indiranagar 100ft Road, BLR', 'HSR Layout Sector 1, BLR', 'BTM Layout 2nd Stage, BLR', 'Whitefield Main Road, BLR', 'Jayanagar 4th Block, BLR'].map(loc => `
            <button class="location-select-btn btn btn-outline" data-loc="${loc}" style="justify-content: flex-start; text-align: left; padding: 12px 16px;">
              <i data-lucide="map-pin" style="color: #059669; width: 18px; height: 18px;"></i>
              <span>${loc}</span>
            </button>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Item Request Modal -->
    <div id="item-request-modal" class="modal-backdrop" style="display: none;">
      <div class="modal-card" style="max-width: 480px; padding: 24px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <h3 style="font-size: 1.25rem;">Request Unlisted Item 🛒</h3>
          <button id="close-item-request-modal-btn" class="btn-icon"><i data-lucide="x"></i></button>
        </div>
        <p style="color: #64748b; font-size: 0.88rem; margin-bottom: 16px;">
          Can't find a specific grocery, brand or bulk item? Tell your local VK Kirana store owner and we will arrange it today!
        </p>
        <form id="item-request-form">
          <div style="margin-bottom: 12px;">
            <label style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 4px;">Item / Brand Name *</label>
            <input type="text" id="req-item-name" required placeholder="e.g. Catch Sabzi Masala 100g, Fortune 5L Jar" style="width: 100%; padding: 10px; border-radius: 8px;" />
          </div>
          <div style="margin-bottom: 12px;">
            <label style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 4px;">Quantity Needed</label>
            <input type="text" id="req-item-qty" placeholder="e.g. 2 packets, 1 tin" style="width: 100%; padding: 10px; border-radius: 8px;" />
          </div>
          <div style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 4px;">Special Note (Optional)</label>
            <textarea id="req-item-note" rows="2" placeholder="e.g. Need latest MFD pack or delivery before evening" style="width: 100%; padding: 10px; border-radius: 8px;"></textarea>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%; padding: 12px;">
            Send Request to Dukan Owner
          </button>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(modalWrapper);
}

function setupEventListeners() {
  // Mobile drawer
  const openMobileBtn = document.getElementById('open-mobile-menu-btn');
  const closeMobileBtn = document.getElementById('close-mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-menu-drawer');

  if (openMobileBtn && mobileDrawer) {
    openMobileBtn.addEventListener('click', () => { mobileDrawer.style.display = 'block'; });
  }
  if (closeMobileBtn && mobileDrawer) {
    closeMobileBtn.addEventListener('click', () => { mobileDrawer.style.display = 'none'; });
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) mobileDrawer.style.display = 'none';
    });
  }

  // User menu dropdown toggle
  const userBtn = document.getElementById('user-menu-btn');
  const userDropdown = document.getElementById('user-dropdown-menu');
  if (userBtn && userDropdown) {
    userBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
    });
    document.addEventListener('click', (e) => {
      if (!userDropdown.contains(e.target)) {
        userDropdown.style.display = 'none';
      }
    });
  }

  // Switch role buttons
  const switchToCustBtn = document.getElementById('switch-to-customer-btn');
  const switchToVendBtn = document.getElementById('switch-to-vendor-btn');
  const logoutBtn = document.getElementById('nav-logout-btn');

  if (switchToCustBtn) {
    switchToCustBtn.addEventListener('click', () => {
      store.loginAsCustomer();
      if (userDropdown) userDropdown.style.display = 'none';
    });
  }

  if (switchToVendBtn) {
    switchToVendBtn.addEventListener('click', () => {
      store.loginAsVendor();
      if (userDropdown) userDropdown.style.display = 'none';
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      store.logout();
      if (userDropdown) userDropdown.style.display = 'none';
    });
  }

  // Modals
  const openLocBtn = document.getElementById('open-location-modal-btn');
  const closeLocBtn = document.getElementById('close-location-modal-btn');
  const locModal = document.getElementById('location-modal');
  if (openLocBtn && locModal) {
    openLocBtn.addEventListener('click', () => { locModal.style.display = 'flex'; });
  }
  if (closeLocBtn && locModal) {
    closeLocBtn.addEventListener('click', () => { locModal.style.display = 'none'; });
  }
  document.querySelectorAll('.location-select-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const loc = btn.getAttribute('data-loc');
      const label = document.getElementById('selected-location-label');
      if (label) label.textContent = loc.split(',')[0];
      if (locModal) locModal.style.display = 'none';
      store.showToast(`Delivery location set to: ${loc}`);
    });
  });

  const openReqBtn = document.getElementById('open-request-modal-btn');
  const closeReqBtn = document.getElementById('close-item-request-modal-btn');
  const reqModal = document.getElementById('item-request-modal');
  if (openReqBtn && reqModal) {
    openReqBtn.addEventListener('click', () => { reqModal.style.display = 'flex'; });
  }
  if (closeReqBtn && reqModal) {
    closeReqBtn.addEventListener('click', () => { reqModal.style.display = 'none'; });
  }

  const reqForm = document.getElementById('item-request-form');
  if (reqForm) {
    reqForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = store.getUser();
      const name = document.getElementById('req-item-name').value;
      const qty = document.getElementById('req-item-qty').value;
      const note = document.getElementById('req-item-note').value;

      store.addRequestedItem({
        name,
        qty: qty || '1 unit',
        note: note || '',
        customerName: user ? user.name : 'Walk-in Customer',
        customerPhone: user ? user.phone : '+91 98765 00000'
      });

      reqForm.reset();
      if (reqModal) reqModal.style.display = 'none';
    });
  }

  // Live Auto-complete Search
  const searchInput = document.getElementById('global-search-input');
  const searchDropdown = document.getElementById('search-dropdown-results');

  if (searchInput && searchDropdown) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value.trim().toLowerCase();
      if (val.length < 2) {
        searchDropdown.style.display = 'none';
        return;
      }

      const products = store.getProducts();
      const expanded = getExpandedSearchTerms(val);
      const matches = products.filter(p => {
        const text = [p.name, p.brand, p.categoryName, p.description || ''].join(' ').toLowerCase();
        return text.includes(val) || expanded.some(term => text.includes(term));
      }).slice(0, 5);

      if (matches.length === 0) {
        searchDropdown.innerHTML = `<div style="padding: 12px; color: #94a3b8; font-size: 0.88rem;">No products found for "${val}"</div>`;
      } else {
        searchDropdown.innerHTML = matches.map(m => `
          <a href="product-details.html?id=${m.id}" style="display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-bottom: 1px solid #f1f5f9; text-decoration: none; color: #0f172a; transition: background 0.2s;" onmouseover="this.style.backgroundColor='#f8fafc'" onmouseout="this.style.backgroundColor='transparent'">
            <img src="${m.image}" alt="${m.name}" style="width: 38px; height: 38px; object-fit: cover; border-radius: 6px;" />
            <div style="flex: 1; min-width: 0;">
              <div style="font-size: 0.86rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${m.name}</div>
              <div style="font-size: 0.78rem; color: #64748b;">${m.unit} • ₹${m.discountPrice || m.price}</div>
            </div>
            <span style="font-size: 0.75rem; font-weight: 700; color: #059669;">View</span>
          </a>
        `).join('');
      }
      searchDropdown.style.display = 'block';
    });

    document.addEventListener('click', (e) => {
      if (!searchDropdown.contains(e.target) && e.target !== searchInput) {
        searchDropdown.style.display = 'none';
      }
    });
  }
}

// Reusable Product Card HTML Generator
export function renderProductCard(product) {
  const isWish = store.isInWishlist(product.id);
  const cart = store.getCart();
  const cartItem = cart.find(i => i.product.id === product.id);
  const qty = cartItem ? cartItem.quantity : 0;
  const price = product.discountPrice || product.price;

  return `
    <div class="product-card-3d" data-product-id="${product.id}">
      <div class="product-image-wrap">
        <a href="product-details.html?id=${product.id}">
          <img src="${product.image}" alt="${product.name}" loading="lazy" />
        </a>
        <div class="product-card-badges">
          ${product.discount ? `<span class="badge badge-discount">${product.discount}% OFF</span>` : ''}
          ${product.isDeal ? `<span class="badge badge-deal">⚡ DEAL</span>` : ''}
          ${product.isFresh ? `<span class="badge badge-fresh">TAAZA</span>` : ''}
        </div>
        <button class="wishlist-btn-corner ${isWish ? 'active' : ''}" onclick="window.vkToggleWishlist('${product.id}')" aria-label="Wishlist">
          <span style="font-size: 1.1rem; color: ${isWish ? '#ef4444' : '#94a3b8'};">♥</span>
        </button>
      </div>

      <div class="product-card-body">
        <div class="product-brand">${product.brand || 'Kirana'}</div>
        <a href="product-details.html?id=${product.id}" class="product-name" title="${product.name}">
          ${product.name}
        </a>
        <div class="product-unit">${product.unit}</div>

        <div class="product-price-row">
          <span class="price-current">₹${price}</span>
          ${product.price > price ? `<span class="price-original">₹${product.price}</span>` : ''}
          ${product.discount ? `<span class="price-discount-tag">Save ₹${product.price - price}</span>` : ''}
        </div>

        <div id="product-card-action-${product.id}">
          ${qty > 0 ? `
            <div class="product-qty-selector">
              <button class="product-qty-btn" onclick="window.vkUpdateCart('${product.id}', ${qty - 1})">-</button>
              <span style="font-weight: 800; font-size: 0.95rem;">${qty}</span>
              <button class="product-qty-btn" onclick="window.vkUpdateCart('${product.id}', ${qty + 1})">+</button>
            </div>
          ` : `
            <button class="product-add-btn" onclick="window.vkAddToCart('${product.id}')">
              <span>+ Add to Cart</span>
            </button>
          `}
        </div>
      </div>
    </div>
  `;
}

// Global click handlers attached to window
window.vkAddToCart = (id) => {
  const p = store.getProductById(id);
  if (p) store.addToCart(p, 1);
};

window.vkUpdateCart = (id, newQty) => {
  store.updateCartQty(id, newQty);
};

window.vkToggleWishlist = (id) => {
  const p = store.getProductById(id);
  if (p) store.toggleWishlist(p);
};
