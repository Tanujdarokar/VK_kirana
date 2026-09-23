import React, { useState, useRef, useEffect } from 'react';
import { X, RotateCw, ZoomIn, ZoomOut, ShoppingBag, Heart, ShieldCheck, Truck, Sparkles, Check, Info } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Rating } from '../common/Rating';

export const Product3DViewerModal = ({ product, isOpen, onClose }) => {
  const [rotation, setRotation] = useState({ x: -10, y: 15 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  const [activeSide, setActiveSide] = useState('front'); // 'front' or 'back' (nutrition/FSSAI)
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const animationRef = useRef(null);

  // Auto spin loop
  useEffect(() => {
    if (isAutoSpinning) {
      const spin = () => {
        setRotation((prev) => ({ ...prev, y: (prev.y + 1) % 360 }));
        animationRef.current = requestAnimationFrame(spin);
      };
      animationRef.current = requestAnimationFrame(spin);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isAutoSpinning]);

  if (!isOpen || !product) return null;

  const inWishlist = isInWishlist(product.id);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setIsAutoSpinning(false);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setRotation((prev) => ({
      x: Math.max(-45, Math.min(45, prev.x - deltaY * 0.4)),
      y: (prev.y + deltaX * 0.5) % 360
    }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setIsAutoSpinning(false);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - dragStart.x;
    const deltaY = e.touches[0].clientY - dragStart.y;
    setRotation((prev) => ({
      x: Math.max(-45, Math.min(45, prev.x - deltaY * 0.4)),
      y: (prev.y + deltaX * 0.5) % 360
    }));
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const setPresetView = (view) => {
    setIsAutoSpinning(false);
    if (view === 'front') {
      setRotation({ x: 0, y: 0 });
      setActiveSide('front');
    } else if (view === 'isometric') {
      setRotation({ x: -15, y: 35 });
    } else if (view === 'side') {
      setRotation({ x: 0, y: 85 });
    } else if (view === 'back') {
      setRotation({ x: 0, y: 180 });
      setActiveSide('back');
    } else if (view === 'top') {
      setRotation({ x: -45, y: 0 });
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1200, backdropFilter: 'blur(8px)' }}>
      <div
        className="modal-card"
        style={{
          maxWidth: '920px',
          width: '95%',
          maxHeight: '92vh',
          padding: 0,
          overflow: 'hidden',
          borderRadius: '24px',
          background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)',
          color: '#f8fafc',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(16, 185, 129, 0.15)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(15, 23, 42, 0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
            }}>
              <Sparkles size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, letterSpacing: '0.02em', color: '#ffffff' }}>
                3D Product Interactive Viewer
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                Drag to rotate 360° • Inspect authentic packaging & details
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#cbd5e1',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              transition: 'all 0.2s'
            }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* 3D Stage & Product Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.2fr) minmax(280px, 1fr)' }}>
          {/* 3D Interactive Canvas Area */}
          <div
            style={{
              position: 'relative',
              background: 'radial-gradient(circle at 50% 45%, #1e293b 0%, #090d16 100%)',
              minHeight: '440px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              userSelect: 'none',
              cursor: isDragging ? 'grabbing' : 'grab',
              overflow: 'hidden'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Ambient Spotlight / Grid Effect */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '340px',
              height: '340px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, rgba(16, 185, 129, 0) 70%)',
              pointerEvents: 'none'
            }} />

            {/* Circular Stage Pedestal Floor */}
            <div style={{
              position: 'absolute',
              bottom: '50px',
              width: '260px',
              height: '80px',
              borderRadius: '50%',
              background: 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.35) 0%, rgba(15, 23, 42, 0) 70%)',
              transform: 'perspective(600px) rotateX(60deg)',
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.25)',
              pointerEvents: 'none'
            }} />

            {/* 3D Perspective Container */}
            <div
              style={{
                perspective: '1200px',
                width: '260px',
                height: '280px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 5
              }}
            >
              {/* 3D Transform Object */}
              <div
                style={{
                  width: '220px',
                  height: '240px',
                  position: 'relative',
                  transformStyle: 'preserve-3d',
                  transform: `scale(${zoom}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                  transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1)'
                }}
              >
                {/* 3D Front Face */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '2px solid rgba(255, 255, 255, 0.8)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.6), inset 0 0 15px rgba(255,255,255,0.7)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(20px)'
                  }}
                >
                  {/* Veg Pure Symbol */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    width: '18px',
                    height: '18px',
                    border: '2px solid #16a34a',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'white'
                  }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }} />
                  </div>

                  {/* Brand Tag Top Right */}
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    color: '#059669',
                    letterSpacing: '0.05em'
                  }}>
                    {product.brand}
                  </span>

                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      maxHeight: '160px',
                      maxWidth: '85%',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.15))'
                    }}
                  />

                  <div style={{
                    marginTop: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    textAlign: 'center',
                    lineHeight: 1.2
                  }}>
                    {product.unit}
                  </div>
                </div>

                {/* 3D Back Face (Authentic Kirana Nutrition / Batch / FSSAI Info) */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '16px',
                    background: '#f8fafc',
                    color: '#0f172a',
                    border: '2px solid #cbd5e1',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '14px',
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg) translateZ(20px)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0f172a' }}>NUTRITION FACTS</span>
                      <span style={{ fontSize: '0.6rem', color: '#64748b' }}>Per 100g/ml</span>
                    </div>

                    <div style={{ fontSize: '0.65rem', color: '#334155', marginTop: '6px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
                      <div>⚡ Energy: <strong>360 kcal</strong></div>
                      <div>🌾 Protein: <strong>10.5 g</strong></div>
                      <div>🍞 Carbs: <strong>72.0 g</strong></div>
                      <div>💧 Fat: <strong>1.4 g</strong></div>
                      <div>🌱 Fiber: <strong>8.5 g</strong></div>
                      <div>🧂 Sodium: <strong>12 mg</strong></div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '6px', fontSize: '0.62rem', color: '#475569' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: '#059669' }}>FSSAI Lic No:</span>
                      <span style={{ fontFamily: 'monospace' }}>10014011001895</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
                      <span>Batch No:</span>
                      <span style={{ fontFamily: 'monospace' }}>VK-2026-IND</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
                      <span>Best Before:</span>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>9 Months from mfg</span>
                    </div>
                  </div>
                </div>

                {/* 3D Side Thickness Faces for Realistic Depth */}
                <div style={{
                  position: 'absolute',
                  width: '40px',
                  height: '240px',
                  background: 'linear-gradient(to right, #059669, #10b981)',
                  left: '-20px',
                  transform: 'rotateY(-90deg)',
                  borderRadius: '6px',
                  opacity: 0.85
                }} />
                <div style={{
                  position: 'absolute',
                  width: '40px',
                  height: '240px',
                  background: 'linear-gradient(to left, #059669, #10b981)',
                  right: '-20px',
                  transform: 'rotateY(90deg)',
                  borderRadius: '6px',
                  opacity: 0.85
                }} />
              </div>
            </div>

            {/* Bottom 3D Camera Controls */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '20px',
              zIndex: 10,
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <button
                onClick={() => setIsAutoSpinning(!isAutoSpinning)}
                style={{
                  padding: '4px 10px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  background: isAutoSpinning ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <RotateCw size={12} className={isAutoSpinning ? 'animate-spin' : ''} />
                <span>{isAutoSpinning ? 'Stop' : '360° Spin'}</span>
              </button>

              <button
                onClick={() => setPresetView('front')}
                style={{ padding: '4px 8px', fontSize: '0.72rem', background: 'rgba(255,255,255,0.08)', color: '#cbd5e1', borderRadius: '8px' }}
              >
                Front
              </button>

              <button
                onClick={() => setPresetView('isometric')}
                style={{ padding: '4px 8px', fontSize: '0.72rem', background: 'rgba(255,255,255,0.08)', color: '#cbd5e1', borderRadius: '8px' }}
              >
                3D Angle
              </button>

              <button
                onClick={() => setPresetView('back')}
                style={{ padding: '4px 8px', fontSize: '0.72rem', background: 'rgba(255,255,255,0.08)', color: '#cbd5e1', borderRadius: '8px' }}
              >
                Nutrition & FSSAI
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '6px', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '8px' }}>
                <button
                  onClick={() => setZoom((z) => Math.max(0.7, z - 0.15))}
                  style={{ color: '#94a3b8', padding: '2px' }}
                  title="Zoom Out"
                >
                  <ZoomOut size={14} />
                </button>
                <button
                  onClick={() => setZoom((z) => Math.min(1.4, z + 0.15))}
                  style={{ color: '#94a3b8', padding: '2px' }}
                  title="Zoom In"
                >
                  <ZoomIn size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Product Overview & Buy Section */}
          <div style={{
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: '#0f172a',
            borderLeft: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {product.brand}
                </span>
                <span style={{ fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.1)', color: '#cbd5e1', padding: '2px 8px', borderRadius: '6px' }}>
                  Pack: {product.unit}
                </span>
              </div>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.3, marginBottom: '10px' }}>
                {product.name}
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Rating rating={product.rating} reviewsCount={product.reviewsCount} />
                <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>
                  ● In Stock ({product.stock} units)
                </span>
              </div>

              {/* Price Display */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '14px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '18px'
              }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  <span style={{ fontSize: '1.65rem', fontWeight: 800, color: '#10b981' }}>
                    ₹{product.discountPrice || product.price}
                  </span>
                  {product.discountPrice && (
                    <span style={{ fontSize: '1rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                      ₹{product.price}
                    </span>
                  )}
                  {product.discount > 0 && (
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      background: 'rgba(239, 68, 68, 0.2)',
                      color: '#f87171',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}>
                      SAVE ₹{product.price - product.discountPrice} ({product.discount}% OFF)
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                  Inclusive of all taxes • Cash on Delivery available at doorstep
                </div>
              </div>

              {/* Indian Kirana Highlights */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                  <ShieldCheck size={16} color="#10b981" />
                  <span>100% Genuine Sealed Indian Kirana Pack</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                  <Truck size={16} color="#10b981" />
                  <span>Fast 15-Minute Delivery to your door</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                  <Check size={16} color="#10b981" />
                  <span>Pay Cash on Delivery or Doorstep UPI</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                {/* Quantity */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  overflow: 'hidden'
                }}>
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    style={{ padding: '8px 14px', color: '#cbd5e1', fontWeight: 800 }}
                  >
                    -
                  </button>
                  <span style={{ padding: '8px 12px', fontWeight: 800, color: 'white', fontSize: '0.95rem' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    style={{ padding: '8px 14px', color: '#cbd5e1', fontWeight: 800 }}
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  style={{
                    flex: 1,
                    height: '46px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                    border: 'none'
                  }}
                >
                  <ShoppingBag size={18} />
                  <span>Add {quantity > 1 ? `(${quantity}) ` : ''}to Cart • ₹{(product.discountPrice || product.price) * quantity}</span>
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '10px',
                    background: inWishlist ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                    border: `1px solid ${inWishlist ? '#ef4444' : 'rgba(255, 255, 255, 0.15)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: inWishlist ? '#ef4444' : '#cbd5e1'
                  }}
                  title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart size={20} fill={inWishlist ? '#ef4444' : 'none'} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
