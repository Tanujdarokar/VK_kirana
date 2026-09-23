import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Package,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Bot
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useInventory } from '../../context/InventoryContext';
import { categories } from '../../data/categories';
import { getExpandedSearchTerms } from '../../data/aiAssistant';
import { KiranaAIAssistantModal } from '../ai/KiranaAIAssistantModal';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { products } = useInventory();
  const { totalItems, grandTotal } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Modals & Drawers
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsSearchFocused(false);
  }, [location.pathname]);

  // Outside click listeners
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // AI-Powered Live search filtering (recognizes "atta", "tel", "doodh", "chini", "namak", etc.)
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      const expandedTerms = getExpandedSearchTerms(q);

      const filtered = products
        .filter((p) => {
          const haystack = [
            p.name,
            p.brand,
            p.categoryName,
            p.description || '',
            p.unit || ''
          ].join(' ').toLowerCase();

          return (
            haystack.includes(q) ||
            expandedTerms.some((term) => haystack.includes(term))
          );
        })
        .slice(0, 6);

      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, products]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* Top Banner Ticker with subtle 3D glowing sheen */}
      <div
        style={{
          background: 'linear-gradient(90deg, #064e3b 0%, #047857 50%, #065f46 100%)',
          color: '#ecfdf5',
          fontSize: '0.8rem',
          fontWeight: 600,
          padding: '7px 0',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(6, 78, 59, 0.2)'
        }}
      >
        <div
          className="container"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={14} color="#facc15" fill="#facc15" />
            <span>⚡ Express 15-Min Local Kirana Delivery</span>
          </div>
          <span style={{ opacity: 0.5 }}>•</span>
          <div>
            100% Shuddh & Taaza Daily Essentials • Desi Grocery Wholesale Rates
          </div>
          <span style={{ opacity: 0.5 }}>•</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} color="#34d399" />
            <span>Cash on Delivery (COD) Available</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #e2e8f0',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}
      >
        <div className="container" style={{ padding: '12px 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            
            {/* Left: Mobile Menu Toggle & Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <button
                className="btn-icon"
                onClick={() => setIsMobileMenuOpen(true)}
                style={{ display: 'none' }}
                id="mobile-menu-btn"
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>

              {/* Brand Logo with 3D Depth */}
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                <div
                  className="brand-logo-3d"
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: '0 6px 14px rgba(5, 150, 105, 0.35)',
                    transform: 'perspective(600px) rotateY(-4deg)'
                  }}
                >
                  <ShoppingBag size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1 }}>
                    VK<span style={{ color: '#059669' }}>Kirana</span>
                  </div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#047857', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Apni Local Dukan 🛒
                  </div>
                </div>
              </Link>
            </div>

            {/* Middle: Live Auto-complete Search Bar with AI Understanding */}
            <div ref={searchRef} style={{ flex: 1, maxWidth: '540px', position: 'relative' }}>
              <form onSubmit={handleSearchSubmit}>
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', pointerEvents: 'none' }} />
                  <input
                    type="text"
                    placeholder="Search 'atta', 'toor dal', 'amul milk', 'fortune tel', 'sugar'..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    style={{
                      width: '100%',
                      padding: '11px 40px 11px 42px',
                      borderRadius: '12px',
                      backgroundColor: '#f1f5f9',
                      border: isSearchFocused ? '1.5px solid #059669' : '1px solid transparent',
                      fontSize: '0.9rem',
                      color: '#0f172a',
                      outline: 'none',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: isSearchFocused ? '0 0 0 4px rgba(5, 150, 105, 0.12)' : 'none'
                    }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      style={{ position: 'absolute', right: '12px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </form>

              {/* Live Search Suggestions Dropdown */}
              {isSearchFocused && searchQuery.trim().length > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '8px',
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    boxShadow: '0 16px 36px rgba(0,0,0,0.14)',
                    border: '1px solid #e2e8f0',
                    zIndex: 200,
                    overflow: 'hidden',
                    animation: 'modalScale 0.15s ease-out'
                  }}
                >
                  <div
                    style={{
                      padding: '8px 12px',
                      borderBottom: '1px solid #f1f5f9',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#047857',
                      backgroundColor: '#f0fdf4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>Matching Kirana Products ({searchResults.length})</span>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>AI Hindi Synonyms Active</span>
                  </div>
                  {searchResults.length > 0 ? (
                    <div>
                      {searchResults.map((item) => (
                        <Link
                          key={item.id}
                          to={`/product/${item.id}`}
                          onClick={() => setIsSearchFocused(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '10px 14px',
                            borderBottom: '1px solid #f8fafc',
                            transition: 'background-color 0.15s',
                            textDecoration: 'none'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '6px', background: '#f8fafc', padding: '2px' }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>{item.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.brand} • {item.unit}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#047857' }}>₹{item.discountPrice || item.price}</div>
                            {item.discount > 0 && (
                              <span style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 700 }}>{item.discount}% OFF</span>
                            )}
                          </div>
                        </Link>
                      ))}
                      <div style={{ padding: '10px 14px', backgroundColor: '#f8fafc', textAlign: 'center' }}>
                        <button
                          onClick={handleSearchSubmit}
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            color: '#059669',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          View all results for "{searchQuery}" <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                      No groceries matching "{searchQuery}". Press Enter to browse catalog.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: Ask AI, Kirana Manager, Account, Wishlist, Cart */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              
              {/* Ask AI Kirana Assistant Button with 3D animation */}
              <button
                onClick={() => setIsAiModalOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
                  color: 'white',
                  fontSize: '0.86rem',
                  fontWeight: 800,
                  border: '1px solid #34d399',
                  boxShadow: '0 4px 12px rgba(4, 120, 87, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                }}
                title="Ask AI for Instant 1-Week Kirana List or Ration Plan"
              >
                <Bot size={16} color="#facc15" />
                <span className="hide-on-mobile">Ask AI</span>
                <span
                  style={{
                    background: '#facc15',
                    color: '#064e3b',
                    fontSize: '0.65rem',
                    fontWeight: 900,
                    padding: '1px 5px',
                    borderRadius: '8px'
                  }}
                >
                  NEW
                </span>
              </button>

              {/* Store Owner Quick Button */}
              <Link
                to="/admin"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  borderRadius: '10px',
                  backgroundColor: '#0f172a',
                  color: '#34d399',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  border: '1px solid #334155',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  textDecoration: 'none'
                }}
                title="Open Kirana Shop & Money Management"
              >
                <span style={{ fontSize: '0.95rem' }}>🏪</span>
                <span className="hide-on-mobile">Khata / POS</span>
              </Link>
              
              {/* User Account Dropdown */}
              <div ref={userMenuRef} style={{ position: 'relative' }}>
                {isAuthenticated ? (
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 10px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: isUserMenuOpen ? '#f1f5f9' : '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #059669 0%, #0284c7 100%)',
                        color: 'white',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem'
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ textAlign: 'left', lineHeight: 1.2 }} className="hide-on-mobile">
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Namaste,</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{user.name.split(' ')[0]}</div>
                    </div>
                    <ChevronDown size={14} color="#64748b" className="hide-on-mobile" />
                  </button>
                ) : (
                  <Link to="/login" className="btn btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
                    <User size={16} />
                    <span>Login</span>
                  </Link>
                )}

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '8px',
                      width: '220px',
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                      border: '1px solid #e2e8f0',
                      zIndex: 200,
                      overflow: 'hidden',
                      animation: 'modalScale 0.15s ease-out'
                    }}
                  >
                    <div style={{ padding: '12px 14px', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{user?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
                    </div>
                    <div style={{ padding: '6px' }}>
                      <Link
                        to="/admin"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '8px', fontSize: '0.85rem', color: '#047857', backgroundColor: '#ecfdf5', fontWeight: 700, marginBottom: '4px', textDecoration: 'none' }}
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span>🏪</span> Kirana Dukan Manager
                      </Link>
                      <Link
                        to="/orders"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '8px', fontSize: '0.85rem', color: '#334155', textDecoration: 'none' }}
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Package size={16} color="#64748b" /> My Previous Orders
                      </Link>
                      <Link
                        to="/wishlist"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '8px', fontSize: '0.85rem', color: '#334155', textDecoration: 'none' }}
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Heart size={16} color="#64748b" /> Saved Essentials ({wishlistCount})
                      </Link>
                      <Link
                        to="/profile"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '8px', fontSize: '0.85rem', color: '#334155', textDecoration: 'none' }}
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User size={16} color="#64748b" /> Delivery Address & Profile
                      </Link>
                    </div>
                    <div style={{ borderTop: '1px solid #f1f5f9', padding: '6px' }}>
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          color: '#ef4444',
                          fontWeight: 600,
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Wishlist Button */}
              <Link
                to="/wishlist"
                className="btn-icon"
                style={{ position: 'relative', textDecoration: 'none' }}
                aria-label="Wishlist"
                title="Wishlist"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Button */}
              <Link
                to="/cart"
                className="btn btn-primary"
                style={{
                  padding: '8px 14px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
                }}
              >
                <div style={{ position: 'relative' }}>
                  <ShoppingBag size={20} />
                  {totalItems > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        backgroundColor: '#facc15',
                        color: '#064e3b',
                        fontSize: '0.68rem',
                        fontWeight: 900,
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {totalItems}
                    </span>
                  )}
                </div>
                <div style={{ textAlign: 'left', lineHeight: 1.1 }} className="hide-on-mobile">
                  <div style={{ fontSize: '0.7rem', opacity: 0.9 }}>Kirana Cart</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>₹{grandTotal}</div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Secondary Category Navigation Bar */}
        <nav style={{ backgroundColor: '#ffffff', borderTop: '1px solid #f1f5f9' }} className="hide-on-mobile">
          <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '16px', overflowX: 'auto', padding: '8px 1.25rem' }}>
            <Link
              to="/products"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                fontWeight: 800,
                color: '#059669',
                whiteSpace: 'nowrap',
                textDecoration: 'none'
              }}
            >
              <Sparkles size={16} /> All 10 Aisles
            </Link>
            <span style={{ color: '#e2e8f0' }}>|</span>

            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: location.pathname === `/category/${cat.slug}` ? '#059669' : '#475569',
                  whiteSpace: 'nowrap',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                  backgroundColor: location.pathname === `/category/${cat.slug}` ? '#f0fdf4' : 'transparent'
                }}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* AI Assistant Modal */}
      <KiranaAIAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </>
  );
};
