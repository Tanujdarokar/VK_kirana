import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ChevronRight,
  MapPin,
  Star,
  Plus,
  Minus,
  Share2,
  AlertCircle
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { Rating } from '../components/common/Rating';
import { ProductCard } from '../components/product/ProductCard';

export const ProductDetailsPage = () => {
  const { products } = useInventory();
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showSuccess, showError } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeVerified, setPincodeVerified] = useState(null);
  const [activeTab, setActiveTab] = useState('highlights');

  // Customer Reviews State
  const [userReview, setUserReview] = useState({ rating: 5, comment: '', name: '' });
  const [reviewsList, setReviewsList] = useState([
    {
      id: 1,
      name: 'Priyanka Sen',
      date: '3 days ago',
      rating: 5,
      comment: 'Extremely fresh product and the delivery was super quick (less than 15 mins). Will definitely order regularly!'
    },
    {
      id: 2,
      name: 'Rohan Verma',
      date: '1 week ago',
      rating: 5,
      comment: 'Top quality packaging. The expiry date is well into the future. Value for money!'
    },
    {
      id: 3,
      name: 'Sneha Kapoor',
      date: '2 weeks ago',
      rating: 4,
      comment: 'Good taste and standard quality as expected from this brand.'
    }
  ]);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <p style={{ color: '#64748b', marginTop: '8px', marginBottom: '20px' }}>
          The product you are looking for is either discontinued or out of stock.
        </p>
        <Link to="/products" className="btn btn-primary">
          Back to Products Catalog
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const gallery = product.images && product.images.length > 0 ? product.images : [product.image];

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincodeInput.length === 6 && /^\d+$/.test(pincodeInput)) {
      setPincodeVerified(true);
      showSuccess(`Delivery available for ${pincodeInput} (Estimated: 15 Mins)`);
    } else {
      setPincodeVerified(false);
      showError('Please enter a valid 6-digit pincode');
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!userReview.name.trim() || !userReview.comment.trim()) {
      showError('Please enter your name and comment.');
      return;
    }
    const newRev = {
      id: Date.now(),
      name: userReview.name.trim(),
      date: 'Just now',
      rating: userReview.rating,
      comment: userReview.comment.trim()
    };
    setReviewsList([newRev, ...reviewsList]);
    setUserReview({ rating: 5, comment: '', name: '' });
    showSuccess('Thank you! Your product review has been submitted.');
  };

  // Related products
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div style={{ padding: '24px 0 60px' }}>
      <div className="container">
        
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#64748b', marginBottom: '20px' }}>
          <Link to="/" style={{ color: '#64748b' }}>Home</Link>
          <ChevronRight size={14} />
          <Link to={`/category/${product.category}`} style={{ color: '#64748b' }}>{product.categoryName}</Link>
          <ChevronRight size={14} />
          <span style={{ color: '#0f172a', fontWeight: 600 }}>{product.name}</span>
        </div>

        {/* Product Overview Card (2 Columns) */}
        <div
          className="card"
          style={{
            padding: '32px',
            marginBottom: '36px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px'
          }}
        >
          {/* Left Column: Image Gallery */}
          <div>
            <div
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                minHeight: '380px',
                marginBottom: '16px'
              }}
            >
              {/* Badges */}
              <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {product.discount > 0 && (
                  <span className="badge badge-discount">{product.discount}% OFF</span>
                )}
                {product.isDeal && <span className="badge badge-deal">⚡ DEAL</span>}
                {product.isFresh && <span className="badge badge-fresh">🌱 100% PURE</span>}
              </div>

              <img
                src={gallery[selectedImage] || product.image}
                alt={product.name}
                style={{
                  maxHeight: '320px',
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
            </div>

            {/* Thumbnail selector */}
            {gallery.length > 1 && (
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '10px',
                      border: selectedImage === idx ? '2px solid #10b981' : '1px solid #e2e8f0',
                      padding: '4px',
                      backgroundColor: '#f8fafc'
                    }}
                  >
                    <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              {/* Brand & Unit Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {product.brand}
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', background: '#f1f5f9', padding: '2px 10px', borderRadius: '6px' }}>
                  {product.unit}
                </span>
              </div>

              {/* Title */}
              <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px', lineHeight: 1.25 }}>
                {product.name}
              </h1>

              {/* Rating & Stock */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '18px' }}>
                <Rating rating={product.rating} reviewsCount={product.reviewsCount} />
                <span style={{ color: '#cbd5e1' }}>•</span>
                <span style={{ fontSize: '0.85rem', color: product.stock > 0 ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                  {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
                </span>
              </div>

              {/* Pricing Breakdown */}
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '14px',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
                  ₹{product.discountPrice || product.price}
                </div>
                {product.discountPrice && (
                  <div style={{ fontSize: '1.15rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                    MRP ₹{product.price}
                  </div>
                )}
                {product.discount > 0 && (
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ef4444' }}>
                    You Save ₹{product.price - product.discountPrice} ({product.discount}% OFF)
                  </div>
                )}
                <div style={{ fontSize: '0.75rem', color: '#64748b', width: '100%' }}>
                  (Inclusive of all taxes)
                </div>
              </div>

              <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, marginBottom: '24px' }}>
                {product.description}
              </p>

              {/* Quantity Controls & Add To Cart CTA */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                {/* Quantity Box */}
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #cbd5e1', borderRadius: '12px', overflow: 'hidden' }}>
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    style={{ padding: '10px 16px', background: '#f8fafc', fontWeight: 700, color: '#475569' }}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span style={{ padding: '10px 18px', fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    style={{ padding: '10px 16px', background: '#f8fafc', fontWeight: 700, color: '#475569' }}
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="btn btn-primary"
                  style={{ flex: 1, height: '48px', fontSize: '1rem' }}
                >
                  <ShoppingBag size={20} />
                  <span>Add to Cart</span>
                </button>

                {/* Buy Now */}
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="btn btn-secondary"
                  style={{ flex: 1, height: '48px', fontSize: '1rem' }}
                >
                  <Zap size={20} />
                  <span>Buy Now</span>
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className="btn-icon"
                  style={{
                    height: '48px',
                    width: '48px',
                    borderRadius: '12px',
                    borderColor: inWishlist ? '#ef4444' : '#cbd5e1',
                    backgroundColor: inWishlist ? '#fef2f2' : 'white',
                    color: inWishlist ? '#ef4444' : '#64748b'
                  }}
                  title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart size={22} fill={inWishlist ? '#ef4444' : 'none'} />
                </button>
              </div>
            </div>

            {/* Delivery Guarantees */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '18px', marginTop: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#475569' }}>
                  <Truck size={16} color="#10b981" />
                  <span>Free delivery above ₹499</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#475569' }}>
                  <RotateCcw size={16} color="#10b981" />
                  <span>Doorstep returns accepted</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Tabs (Features, Nutrition, Reviews) */}
        <div className="card" style={{ padding: '28px', marginBottom: '40px' }}>
          {/* Tab Buttons */}
          <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '24px' }}>
            <button
              onClick={() => setActiveTab('highlights')}
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: activeTab === 'highlights' ? '#10b981' : '#64748b',
                borderBottom: activeTab === 'highlights' ? '2px solid #10b981' : 'none',
                paddingBottom: '12px',
                marginBottom: '-13px'
              }}
            >
              Key Highlights & Quality
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: activeTab === 'nutrition' ? '#10b981' : '#64748b',
                borderBottom: activeTab === 'nutrition' ? '2px solid #10b981' : 'none',
                paddingBottom: '12px',
                marginBottom: '-13px'
              }}
            >
              Nutritional Facts
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: activeTab === 'reviews' ? '#10b981' : '#64748b',
                borderBottom: activeTab === 'reviews' ? '2px solid #10b981' : 'none',
                paddingBottom: '12px',
                marginBottom: '-13px'
              }}
            >
              Customer Reviews ({reviewsList.length})
            </button>
          </div>

          {/* Highlights Tab */}
          {activeTab === 'highlights' && (
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px' }}>
                Why choose this item?
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                {product.features ? (
                  product.features.map((feat, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                        color: '#334155'
                      }}
                    >
                      <Check size={18} color="#10b981" style={{ flexShrink: 0 }} />
                      <span>{feat}</span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#64748b' }}>100% genuine product guaranteed with tamper-proof packaging.</p>
                )}
              </div>
            </div>
          )}

          {/* Nutrition Tab */}
          {activeTab === 'nutrition' && (
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '14px' }}>
                Nutritional Values (Approximate)
              </h3>
              {product.nutrition ? (
                <div style={{ maxWidth: '400px', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                  {Object.entries(product.nutrition).map(([key, val], idx) => (
                    <div
                      key={key}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '10px 16px',
                        backgroundColor: idx % 2 === 0 ? '#f8fafc' : '#ffffff',
                        fontSize: '0.88rem'
                      }}
                    >
                      <span style={{ textTransform: 'capitalize', fontWeight: 600, color: '#475569' }}>{key}</span>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{val}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#64748b' }}>Household cleaning items do not have nutritional values.</p>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                
                {/* Review List */}
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>
                    Verified Ratings & Feedback
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {reviewsList.map((rev) => (
                      <div key={rev.id} style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{rev.name}</div>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{rev.date}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < rev.rating ? '#f59e0b' : '#cbd5e1'} color={i < rev.rating ? '#f59e0b' : '#cbd5e1'} />
                          ))}
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                          "{rev.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Review Form */}
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '12px' }}>
                    Write a Product Review
                  </h4>
                  <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Rating (1 to 5 Stars)
                      </label>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setUserReview({ ...userReview, rating: star })}
                            style={{ padding: '4px' }}
                          >
                            <Star
                              size={22}
                              fill={star <= userReview.rating ? '#f59e0b' : 'none'}
                              color={star <= userReview.rating ? '#f59e0b' : '#cbd5e1'}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Tanuj S"
                        value={userReview.name}
                        onChange={(e) => setUserReview({ ...userReview, name: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Your Review
                      </label>
                      <textarea
                        rows={3}
                        placeholder="How was the quality, taste, freshness, and packaging?"
                        value={userReview.comment}
                        onChange={(e) => setUserReview({ ...userReview, comment: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', fontSize: '0.85rem' }}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: '4px' }}>
                      Submit Review
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="section-header">
              <div className="section-title-wrap">
                <span className="section-tag">
                  Frequently Bought Together
                </span>
                <h2 className="section-title">Similar Groceries in {product.categoryName}</h2>
              </div>
              <Link to={`/category/${product.category}`} className="section-link">
                <span>View More in {product.categoryName}</span>
                <ChevronRight size={18} />
              </Link>
            </div>

            <div className="grid-responsive">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
