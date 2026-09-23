import React, { useState } from 'react';
import { X, Heart, ShoppingBag, Check, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Rating } from './Rating';
import { Link } from 'react-router-dom';

export const QuickViewModal = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!isOpen || !product) return null;

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: '780px', padding: '0', overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            zIndex: 10,
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b'
          }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {/* Image & Badges */}
          <div style={{
            background: '#f8fafc',
            padding: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            minHeight: '320px'
          }}>
            <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {product.discount > 0 && (
                <span className="badge badge-discount">{product.discount}% OFF</span>
              )}
              {product.isDeal && <span className="badge badge-deal">⚡ DEAL</span>}
            </div>

            <img
              src={product.image}
              alt={product.name}
              style={{
                maxHeight: '260px',
                width: 'auto',
                objectFit: 'contain',
                transition: 'transform 0.3s ease'
              }}
            />
          </div>

          {/* Product Details */}
          <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {product.brand}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>
                  {product.unit}
                </span>
              </div>

              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px', lineHeight: 1.3 }}>
                {product.name}
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Rating rating={product.rating} reviewsCount={product.reviewsCount} />
                <span style={{ fontSize: '0.8rem', color: product.stock > 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                  {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
                </span>
              </div>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '14px' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
                  ₹{product.discountPrice || product.price}
                </span>
                {product.discountPrice && (
                  <span style={{ fontSize: '1.05rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                    ₹{product.price}
                  </span>
                )}
                {product.discount > 0 && (
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ef4444' }}>
                    Save ₹{product.price - product.discountPrice}
                  </span>
                )}
              </div>

              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5, marginBottom: '20px' }}>
                {product.description}
              </p>

              {/* Highlights */}
              {product.features && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
                  {product.features.slice(0, 2).map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#334155' }}>
                      <Check size={14} color="#10b981" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                {/* Quantity */}
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    style={{ padding: '8px 14px', background: '#f8fafc', fontWeight: 700, color: '#475569' }}
                  >
                    -
                  </button>
                  <span style={{ padding: '8px 16px', fontWeight: 700, fontSize: '0.95rem' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    style={{ padding: '8px 14px', background: '#f8fafc', fontWeight: 700, color: '#475569' }}
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="btn btn-primary"
                  style={{ flex: 1, height: '44px' }}
                >
                  <ShoppingBag size={18} />
                  <span>Add to Cart</span>
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className="btn-icon"
                  style={{
                    height: '44px',
                    width: '44px',
                    color: inWishlist ? '#ef4444' : '#64748b',
                    borderColor: inWishlist ? '#ef4444' : '#e2e8f0',
                    backgroundColor: inWishlist ? '#fef2f2' : 'white'
                  }}
                  title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart size={20} fill={inWishlist ? '#ef4444' : 'none'} />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link
                  to={`/product/${product.id}`}
                  onClick={onClose}
                  style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981' }}
                >
                  View Full Product Details →
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#64748b' }}>
                  <Truck size={14} color="#10b981" />
                  <span>15-min instant delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
