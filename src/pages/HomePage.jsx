import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  ArrowRight,
  Clock,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Percent,
  Star,
  Quote,
  CheckCircle2,
  Bot,
  ShoppingBag,
  Heart,
  Package
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { categories } from '../data/categories';
import { brands } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';
import { CategoryCard } from '../components/product/CategoryCard';
import { KiranaAIAssistantModal } from '../components/ai/KiranaAIAssistantModal';

export const HomePage = () => {
  const { products } = useInventory();
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPromptPreset, setAiPromptPreset] = useState('');

  // Countdown Timer for Deals of the Day
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOpenAiWithQuery = (presetQuery) => {
    setAiPromptPreset(presetQuery);
    setIsAiModalOpen(true);
  };

  // Filtered collections
  const deals = products.filter((p) => p.isDeal).slice(0, 4);
  const staples = products.filter((p) => p.category === 'atta-flour-grains' || p.category === 'dal-pulses').slice(0, 4);
  const dairyBreakfast = products.filter((p) => p.category === 'dairy-breakfast').slice(0, 4);
  const oilsAndMasala = products.filter((p) => p.category === 'cooking-oil-ghee' || p.category === 'masala-spices').slice(0, 4);
  const teatimeSnacks = products.filter((p) => p.category === 'snacks-biscuits' || p.category === 'beverages').slice(0, 4);

  return (
    <div style={{ paddingBottom: '60px' }}>
      
      {/* 1. HERO SECTION */}
      <section style={{ backgroundColor: '#f0fdf4', padding: '36px 0 44px', borderBottom: '1px solid #dcfce7' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '30px',
              alignItems: 'center'
            }}
          >
            {/* Hero Left Content */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#ffffff',
                  border: '1px solid #bbf7d0',
                  borderRadius: '30px',
                  padding: '6px 14px',
                  marginBottom: '16px',
                  boxShadow: '0 2px 6px rgba(16, 185, 129, 0.1)'
                }}
              >
                <Zap size={16} color="#059669" fill="#059669" />
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#065f46' }}>
                  Aapki Apni Local Kirana Dukan • 15-Min Delivery
                </span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.1rem, 4.2vw, 3.3rem)',
                  fontWeight: 900,
                  color: '#0f172a',
                  lineHeight: 1.15,
                  letterSpacing: '-0.03em',
                  marginBottom: '16px'
                }}
              >
                Shuddh, Taaza Desi Grocery at <span style={{ color: '#059669', textDecoration: 'underline decoration-emerald-300' }}>Wholesale Prices</span>.
              </h1>

              <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.6, marginBottom: '24px', maxWidth: '540px' }}>
                Order chakki-fresh Aashirvaad Atta, Tata Toor Dal, Amul Milk & Pure Ghee, Everest & MDH spices, Parle-G biscuits, and household essentials directly from your neighborhood Kirana store.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <Link to="/products" className="btn btn-primary btn-lg" style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', textDecoration: 'none' }}>
                  <span>Shop All 10 Aisles</span>
                  <ArrowRight size={18} />
                </Link>
                <button
                  onClick={() => handleOpenAiWithQuery('I need groceries for 4 people for one week')}
                  className="btn btn-secondary btn-lg"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1.5px solid #059669', color: '#047857' }}
                >
                  <Bot size={20} color="#059669" />
                  <span>Ask AI Assistant</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '28px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                  <CheckCircle2 size={18} color="#059669" />
                  <span>Free Delivery on ₹499+</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                  <CheckCircle2 size={18} color="#059669" />
                  <span>UPI & Cash on Delivery</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                  <CheckCircle2 size={18} color="#059669" />
                  <span>100% Genuine Brands</span>
                </div>
              </div>
            </div>

            {/* Hero Right Visual Banner Card */}
            <div
              style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(4, 120, 87, 0.15)',
                background: 'linear-gradient(135deg, #064e3b 0%, #047857 60%, #059669 100%)',
                color: 'white',
                padding: '32px 28px'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '180px',
                  height: '180px',
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: '50%'
                }}
              />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span
                  style={{
                    background: '#facc15',
                    color: '#064e3b',
                    fontWeight: 900,
                    fontSize: '0.78rem',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  ✨ AI Quick Order
                </span>
                <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>1-Click Grocery Ration</span>
              </div>

              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, lineHeight: 1.25, marginBottom: '10px' }}>
                "I need groceries for 4 people for one week."
              </h2>
              <p style={{ fontSize: '0.9rem', opacity: 0.9, lineHeight: 1.5, marginBottom: '18px' }}>
                Our Kirana AI builds your complete weekly basket (5kg Atta, 5kg Rice, 1kg Toor Dal, 2L Oil, Sugar, Salt, Tea, Biscuits & Milk) in seconds.
              </p>

              {/* Sample AI Kit Preview Grid */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  borderRadius: '14px',
                  padding: '12px 16px',
                  marginBottom: '20px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '8px',
                  fontSize: '0.82rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <div>🌾 Atta – 5 kg</div>
                <div>🍚 Rice – 5 kg</div>
                <div>🍲 Toor Dal – 1 kg</div>
                <div>🌻 Cooking Oil – 2 L</div>
                <div>🍬 Sugar – 1 kg</div>
                <div>🧂 Tata Salt – 1 kg</div>
                <div>☕ Tata Tea – 500 g</div>
                <div>🍪 Biscuits – 2 pkts</div>
              </div>

              <button
                onClick={() => handleOpenAiWithQuery('I need groceries for 4 people for one week')}
                className="btn"
                style={{
                  width: '100%',
                  backgroundColor: '#facc15',
                  color: '#064e3b',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(250, 204, 21, 0.4)'
                }}
              >
                <Bot size={18} />
                <span>Open AI Assistant & Add to Cart</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EXPLORE 10 INDIAN KIRANA CATEGORIES */}
      <section style={{ padding: '48px 0 36px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase' }}>
                <Package size={16} />
                <span>Kirana Aisles</span>
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
                Shop by Indian Grocery Categories
              </h2>
            </div>
            <Link
              to="/products"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: '#059669',
                fontWeight: 700,
                fontSize: '0.9rem',
                textDecoration: 'none'
              }}
            >
              <span>View All 10 Aisles</span>
              <ChevronRight size={18} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px'
            }}
          >
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. DEALS OF THE DAY WITH LIVE COUNTDOWN */}
      <section style={{ padding: '36px 0 48px', backgroundColor: '#fefce8', borderTop: '1px solid #fef08a', borderBottom: '1px solid #fef08a' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fef08a', color: '#854d0e', padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 800, marginBottom: '6px' }}>
                <Percent size={14} />
                <span>Aaj Ka Khaas Dhamaka</span>
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a' }}>
                Today's Special Kirana Deals
              </h2>
            </div>

            {/* Countdown Timer */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', padding: '8px 16px', borderRadius: '12px', border: '1px solid #fde047', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <Clock size={18} color="#ca8a04" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#713f12' }}>Deal ends in:</span>
              <div style={{ display: 'flex', gap: '4px', fontWeight: 900, color: '#0f172a' }}>
                <span style={{ background: '#fef08a', padding: '2px 6px', borderRadius: '4px' }}>{String(timeLeft.hours).padStart(2, '0')}h</span>
                <span>:</span>
                <span style={{ background: '#fef08a', padding: '2px 6px', borderRadius: '4px' }}>{String(timeLeft.minutes).padStart(2, '0')}m</span>
                <span>:</span>
                <span style={{ background: '#fef08a', padding: '2px 6px', borderRadius: '4px' }}>{String(timeLeft.seconds).padStart(2, '0')}s</span>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '20px'
            }}
          >
            {deals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. DAILY PANTRY STAPLES: ATTA, RICE & DALS */}
      <section style={{ padding: '48px 0 36px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <div style={{ color: '#059669', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase' }}>
                Essential Kitchen Ration
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
                Atta, Rice & Protein-Rich Dals
              </h2>
            </div>
            <Link
              to="/category/atta-flour-grains"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: '#059669',
                fontWeight: 700,
                fontSize: '0.9rem',
                textDecoration: 'none'
              }}
            >
              <span>Explore Grains & Dals</span>
              <ChevronRight size={18} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '20px'
            }}
          >
            {staples.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. FRESH DAIRY & BREAKFAST AISLE */}
      <section style={{ padding: '36px 0 48px', backgroundColor: '#f0fdf4' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <div style={{ color: '#0284c7', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase' }}>
                Subah Ki Taazgi
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
                Fresh Milk, Paneer, Curd, Bread & Eggs
              </h2>
            </div>
            <Link
              to="/category/dairy-breakfast"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: '#0284c7',
                fontWeight: 700,
                fontSize: '0.9rem',
                textDecoration: 'none'
              }}
            >
              <span>View Dairy Aisle</span>
              <ChevronRight size={18} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '20px'
            }}
          >
            {dairyBreakfast.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. COOKING OIL & SPICES */}
      <section style={{ padding: '48px 0 36px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <div style={{ color: '#dc2626', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase' }}>
                Pure Cooking Essentials
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
                Cooking Oils, Pure Ghee & Everest/MDH Masalas
              </h2>
            </div>
            <Link
              to="/category/cooking-oil-ghee"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: '#dc2626',
                fontWeight: 700,
                fontSize: '0.9rem',
                textDecoration: 'none'
              }}
            >
              <span>View Oils & Ghee</span>
              <ChevronRight size={18} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '20px'
            }}
          >
            {oilsAndMasala.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. TEA-TIME & SNACKS AISLE */}
      <section style={{ padding: '36px 0 48px', backgroundColor: '#fefce8' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <div style={{ color: '#b45309', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase' }}>
                Chai & Shaam Ka Nashta
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
                Tata Tea, Red Label, Parle-G, Good Day & Munchies
              </h2>
            </div>
            <Link
              to="/category/snacks-biscuits"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: '#b45309',
                fontWeight: 700,
                fontSize: '0.9rem',
                textDecoration: 'none'
              }}
            >
              <span>View Teatime Snacks</span>
              <ChevronRight size={18} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '20px'
            }}
          >
            {teatimeSnacks.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. POPULAR INDIAN BRANDS BANNER */}
      <section style={{ padding: '40px 0', borderTop: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              Trusted Indian Kirana Brands You Love
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              100% Original Sealed Packs Direct from Authorized Distributors
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              flexWrap: 'wrap'
            }}
          >
            {brands.slice(0, 16).map((brand) => (
              <Link
                key={brand}
                to={`/products?search=${encodeURIComponent(brand)}`}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#334155',
                  textDecoration: 'none',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#059669';
                  e.currentTarget.style.color = '#059669';
                  e.currentTarget.style.backgroundColor = '#ecfdf5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.color = '#334155';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 9. REAL INDIAN CUSTOMER TESTIMONIALS */}
      <section style={{ padding: '48px 0', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>
              Loved by Over 50,000+ Indian Households
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
              Real experiences from families across Bengaluru, Mumbai, Delhi NCR, Pune & Hyderabad
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}
          >
            {[
              {
                name: 'Ananya Deshmukh',
                city: 'Pune, Maharashtra',
                comment: 'The AI assistant grocery list feature saved me so much time! I just typed "Weekly ration for 4 people" and it added fresh Aashirvaad Atta, Tata Dal, Oil, and Amul Milk with one click.',
                rating: 5
              },
              {
                name: 'Rajesh Agarwal',
                city: 'Bengaluru, Karnataka',
                comment: 'Wholesale prices better than the local market. Milk, dahi, and farm eggs arrive within 15 minutes right at my doorstep. UPI payment on delivery works flawlessly.',
                rating: 5
              },
              {
                name: 'Priya Sharma',
                city: 'Gurugram, Delhi NCR',
                comment: 'Authentic MDH and Everest masalas, Fortune oil, and Tata Salt. The packaging is untouched and pristine. The 1-click reorder feature makes monthly ration a breeze.',
                rating: 5
              }
            ].map((review, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  padding: '24px',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', gap: '3px', marginBottom: '12px' }}>
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={16} color="#eab308" fill="#eab308" />
                  ))}
                </div>
                <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.6, marginBottom: '16px', fontStyle: 'italic' }}>
                  "{review.comment}"
                </p>
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>{review.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>📍 {review.city}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kirana AI Assistant Modal */}
      <KiranaAIAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        initialQuery={aiPromptPreset}
      />
    </div>
  );
};
