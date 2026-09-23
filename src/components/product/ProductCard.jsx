import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Plus, Minus, Check, Box, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Rating } from '../common/Rating';
import { QuickViewModal } from '../common/QuickViewModal';
import { Product3DViewerModal } from './Product3DViewerModal';

export const ProductCard = ({ product }) => {
  const { addToCart, getItemQuantity, updateQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [is3DViewerOpen, setIs3DViewerOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // 3D Tilt calculation
  const cardRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({});

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -9; // Max 9 deg
    const rotateY = ((x - centerX) / centerX) * 9;  // Max 9 deg

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out'
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
    });
  };

  const inWishlist = isInWishlist(product.id);
  const cartQuantity = getItemQuantity(product.id);
  const isOutOfStock = product.stock <= 0;

  return (
    <>
      <div
        ref={cardRef}
        className="card product-card-3d"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          padding: '14px',
          height: '100%',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          ...tiltStyle
        }}
      >
        {/* Top Floating Badges & Wishlist */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {product.discount > 0 && (
              <span className="badge badge-discount" style={{ fontSize: '0.7rem' }}>
                {product.discount}% OFF
              </span>
            )}
            {product.isDeal && (
              <span className="badge badge-deal" style={{ fontSize: '0.65rem' }}>
                ⚡ DEAL
              </span>
            )}
            {product.isFresh && (
              <span className="badge badge-fresh" style={{ fontSize: '0.65rem' }}>
                🌱 PURE
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {/* 3D View Trigger Icon */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setIs3DViewerOpen(true);
              }}
              title="Interactive 3D View"
              aria-label="3D View"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#059669',
                boxShadow: '0 2px 5px rgba(16, 185, 129, 0.15)',
                transition: 'all 0.2s ease'
              }}
            >
              <Box size={16} />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(product);
              }}
              aria-label="Toggle Wishlist"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: inWishlist ? '#fef2f2' : '#ffffff',
                border: `1px solid ${inWishlist ? '#fca5a5' : '#e2e8f0'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: inWishlist ? '#ef4444' : '#94a3b8',
                boxShadow: '0 2px 5px rgba(0,0,0,0.06)',
                transition: 'all 0.2s ease'
              }}
            >
              <Heart size={16} fill={inWishlist ? '#ef4444' : 'none'} />
            </button>
          </div>
        </div>

        {/* Product Image & Quick View / 3D Triggers */}
        <div
          style={{
            position: 'relative',
            height: '160px',
            margin: '8px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            overflow: 'hidden'
          }}
        >
          <Link to={`/product/${product.id}`} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              style={{
                maxHeight: '130px',
                maxWidth: '85%',
                objectFit: 'contain',
                transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: isHovered ? 'scale(1.1) translateY(-4px)' : 'scale(1)'
              }}
            />
          </Link>

          {/* 3D View & Quick View Actions on Hover */}
          <div
            style={{
              position: 'absolute',
              bottom: isHovered ? '8px' : '-45px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '6px',
              transition: 'all 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
              opacity: isHovered ? 1 : 0,
              zIndex: 3
            }}
          >
            <button
              onClick={() => setIs3DViewerOpen(true)}
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.95)',
                backdropFilter: 'blur(4px)',
                color: 'white',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '6px 10px',
                borderRadius: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
                border: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              <Box size={13} />
              <span>3D View</span>
            </button>

            <button
              onClick={() => setIsQuickViewOpen(true)}
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.88)',
                backdropFilter: 'blur(4px)',
                color: 'white',
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '6px 10px',
                borderRadius: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                border: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              <Eye size={13} />
              <span>Quick</span>
            </button>
          </div>
        </div>

        {/* Product Information */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {product.brand}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#64748b', backgroundColor: '#f1f5f9', padding: '1px 6px', borderRadius: '4px' }}>
                {product.unit}
              </span>
            </div>

            <Link to={`/product/${product.id}`}>
              <h3
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  color: '#1e293b',
                  lineHeight: 1.35,
                  marginBottom: '8px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  height: '2.5rem'
                }}
                title={product.name}
              >
                {product.name}
              </h3>
            </Link>

            <div style={{ marginBottom: '10px' }}>
              <Rating rating={product.rating} reviewsCount={product.reviewsCount} size={13} />
            </div>
          </div>

          {/* Pricing & Add/Quantity Actions */}
          <div style={{ paddingTop: '8px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                  ₹{product.discountPrice || product.price}
                </span>
                {product.discountPrice && (
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                    ₹{product.price}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>
                15 Mins Delivery
              </div>
            </div>

            {/* Cart Button or Counter */}
            <div>
              {isOutOfStock ? (
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#ef4444', background: '#fef2f2', padding: '4px 8px', borderRadius: '6px' }}>
                  Out of Stock
                </span>
              ) : cartQuantity > 0 ? (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: '#10b981',
                    borderRadius: '8px',
                    color: 'white',
                    overflow: 'hidden',
                    boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <button
                    onClick={() => updateQuantity(product.id, cartQuantity - 1)}
                    style={{ padding: '6px 8px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ padding: '0 6px', fontWeight: 700, fontSize: '0.85rem' }}>
                    {cartQuantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, cartQuantity + 1)}
                    style={{ padding: '6px 8px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addToCart(product, 1)}
                  className="btn btn-secondary btn-sm"
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    borderRadius: '8px'
                  }}
                >
                  <Plus size={14} />
                  <span>ADD</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />

      {/* 3D Product Interactive Viewer Modal */}
      <Product3DViewerModal
        product={product}
        isOpen={is3DViewerOpen}
        onClose={() => setIs3DViewerOpen(false)}
      />
    </>
  );
};
