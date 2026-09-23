import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Zap,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Mail,
  Send,
  Phone,
  MapPin,
  Heart
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { categories } from '../../data/categories';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const { showSuccess, showError } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showError('Please enter a valid email address.');
      return;
    }
    showSuccess('Thank you for subscribing! Check your inbox for your ₹100 discount coupon.');
    setEmail('');
  };

  return (
    <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', marginTop: 'auto', borderTop: '1px solid #1e293b' }}>
      
      {/* Value Propositions Strip */}
      <div style={{ borderBottom: '1px solid #1e293b', padding: '36px 0', backgroundColor: '#0b1120' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Zap size={24} color="#10b981" />
              </div>
              <div>
                <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '2px' }}>Superfast 15-Min Delivery</h4>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Delivered fresh from local dark stores</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ShieldCheck size={24} color="#3b82f6" />
              </div>
              <div>
                <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '2px' }}>100% Quality Guarantee</h4>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Rigorous 5-step quality inspection</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <RotateCcw size={24} color="#f59e0b" />
              </div>
              <div>
                <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '2px' }}>No-Questions Return</h4>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Instant refunds on doorstep rejection</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Headphones size={24} color="#a855f7" />
              </div>
              <div>
                <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '2px' }}>24/7 Dedicated Support</h4>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Friendly support via chat and phone</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="container" style={{ padding: '48px 1.25rem 36px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '36px',
          marginBottom: '40px'
        }}>
          
          {/* Brand Info */}
          <div style={{ maxWidth: '320px' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingBag size={20} />
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white' }}>
                VK<span style={{ color: '#10b981' }}>Commerce</span>
              </span>
            </Link>
            <p style={{ fontSize: '0.86rem', lineHeight: 1.6, color: '#94a3b8', marginBottom: '16px' }}>
              VKCommerce is India's premier instant grocery delivery platform. Bringing daily pantry essentials, dairy, grains, beverages, and snacks straight to your doorstep.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={15} color="#10b981" /> <span>1800-419-8899 (Toll Free)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={15} color="#10b981" /> <span>care@vkcommerce.in</span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px' }}>
              Popular Categories
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              {categories.slice(0, 6).map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  style={{ color: '#94a3b8', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => (e.target.style.color = '#10b981')}
                  onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Customer Support & Account */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px' }}>
              Customer Care
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <Link to="/orders" style={{ color: '#94a3b8' }}>Track My Order</Link>
              <Link to="/cart" style={{ color: '#94a3b8' }}>Shopping Cart</Link>
              <Link to="/wishlist" style={{ color: '#94a3b8' }}>My Wishlist</Link>
              <Link to="/profile" style={{ color: '#94a3b8' }}>My Account & Addresses</Link>
              <Link to="/products" style={{ color: '#94a3b8' }}>Deals & Offers</Link>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>
              Get Weekly Fresh Deals
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '14px', lineHeight: 1.5 }}>
              Subscribe and receive exclusive promo codes, flash sale alerts, and weekly recipe inspirations.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '6px' }}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: 'white',
                  fontSize: '0.85rem',
                  flex: 1
                }}
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                style={{ borderRadius: '10px', padding: '0 14px' }}
                aria-label="Subscribe"
              >
                <Send size={16} />
              </button>
            </form>
            
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
                100% SECURE PAYMENTS
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.72rem', background: '#1e293b', padding: '4px 8px', borderRadius: '4px', color: '#cbd5e1' }}>UPI (GPay/PhonePe)</span>
                <span style={{ fontSize: '0.72rem', background: '#1e293b', padding: '4px 8px', borderRadius: '4px', color: '#cbd5e1' }}>Visa / Mastercard</span>
                <span style={{ fontSize: '0.72rem', background: '#1e293b', padding: '4px 8px', borderRadius: '4px', color: '#cbd5e1' }}>Cash on Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div style={{
          borderTop: '1px solid #1e293b',
          paddingTop: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.8rem',
          color: '#64748b'
        }}>
          <div>
            © {new Date().getFullYear()} VKCommerce Technologies Private Limited. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>FSSAI Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
