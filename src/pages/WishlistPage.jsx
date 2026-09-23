import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { Rating } from '../components/common/Rating';

export const WishlistPage = () => {
  const { wishlist, removeFromWishlist, moveToCart, moveAllToCart, clearWishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: '#fef2f2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          color: '#ef4444'
        }}>
          <Heart size={40} />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
          Your Wishlist is Empty
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '420px', margin: '0 auto 24px' }}>
          Save your favorite grocery essentials here to easily add them to your cart for regular weekly restocks.
        </p>
        <Link to="/products" className="btn btn-primary btn-lg">
          <Sparkles size={18} />
          <span>Explore Grocery Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px 0 70px' }}>
      <div className="container">
        
        {/* Header & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
              My Wishlist ({wishlist.length} {wishlist.length === 1 ? 'item' : 'items'})
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Saved essentials ready for one-click transfer to cart
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={clearWishlist}
              style={{
                fontSize: '0.82rem',
                color: '#ef4444',
                fontWeight: 600,
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #fee2e2',
                backgroundColor: '#fef2f2'
              }}
            >
              Clear All
            </button>

            <button
              onClick={moveAllToCart}
              className="btn btn-primary btn-sm"
            >
              <ShoppingBag size={16} />
              <span>Move All to Cart</span>
            </button>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid-responsive">
          {wishlist.map((product) => {
            const activePrice = product.discountPrice || product.price;

            return (
              <div
                key={product.id}
                className="card"
                style={{
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}
              >
                {/* Remove button */}
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ef4444',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                  title="Remove from wishlist"
                >
                  <Trash2 size={15} />
                </button>

                <div>
                  <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', borderRadius: '10px', marginBottom: '12px' }}>
                    <img src={product.image} alt={product.name} style={{ maxHeight: '110px', objectFit: 'contain' }} />
                  </div>

                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>
                    {product.brand}
                  </span>

                  <Link to={`/product/${product.id}`}>
                    <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#1e293b', marginBottom: '6px', lineHeight: 1.3 }}>
                      {product.name}
                    </h3>
                  </Link>

                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '8px' }}>
                    Unit: {product.unit}
                  </div>

                  <Rating rating={product.rating} reviewsCount={product.reviewsCount} size={12} />
                </div>

                <div style={{ marginTop: '14px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                      ₹{activePrice}
                    </span>
                    {product.discountPrice && (
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                        ₹{product.price}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => moveToCart(product)}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
                  >
                    <ShoppingBag size={16} />
                    <span>Move to Cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
