import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Banknote
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    originalSubtotal,
    productSavings,
    deliveryFee,
    handlingFee,
    grandTotal,
    totalSavings,
    amountNeededForFreeDelivery,
    freeDeliveryProgress
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div
          style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            backgroundColor: '#ecfdf5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: '#059669',
            boxShadow: '0 8px 24px rgba(5, 150, 105, 0.2)'
          }}
        >
          <ShoppingBag size={44} />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}>
          Your Kirana Cart is Empty
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '420px', margin: '0 auto 24px' }}>
          Looks like you haven't added any fresh groceries to your cart yet. Explore our fresh dairy, grains, spices, and snacks!
        </p>
        <Link to="/products" className="btn btn-primary btn-lg" style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', textDecoration: 'none' }}>
          <Sparkles size={18} />
          <span>Explore Kirana Aisles</span>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px 0 70px' }}>
      <div className="container">
        
        {/* Page Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a' }}>
              My Kirana Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Review your items and proceed to instant Cash on Delivery checkout
            </p>
          </div>
          <button
            onClick={clearCart}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              color: '#ef4444',
              fontWeight: 700,
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #fee2e2',
              backgroundColor: '#fef2f2',
              cursor: 'pointer'
            }}
          >
            <Trash2 size={15} /> Clear Entire Cart
          </button>
        </div>

        {/* Free Delivery Progress Bar */}
        <div
          className="card"
          style={{
            padding: '16px 20px',
            marginBottom: '24px',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
            borderColor: '#bbf7d0'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 700, color: '#065f46' }}>
              <Truck size={18} color="#059669" />
              {amountNeededForFreeDelivery > 0 ? (
                <span>Add <strong>₹{amountNeededForFreeDelivery}</strong> more to unlock <strong>FREE Delivery!</strong></span>
              ) : (
                <span>🎉 Congratulations! You unlocked <strong>FREE Delivery!</strong></span>
              )}
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#059669' }}>
              {Math.round(freeDeliveryProgress)}%
            </span>
          </div>

          <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${freeDeliveryProgress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #059669 0%, #34d399 100%)',
                borderRadius: '4px',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* Cart Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px', alignItems: 'start' }} className="cart-layout">
          
          {/* Left Column: Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {cartItems.map((item) => {
              const unitPrice = item.product.discountPrice || item.product.price;
              const originalPrice = item.product.price;
              const itemTotal = unitPrice * item.quantity;
              const itemSavings = (originalPrice - unitPrice) * item.quantity;

              return (
                <div
                  key={item.product.id}
                  className="card"
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    flexWrap: 'wrap'
                  }}
                >
                  {/* Product Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '240px' }}>
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      style={{
                        width: '72px',
                        height: '72px',
                        objectFit: 'contain',
                        background: '#f8fafc',
                        borderRadius: '10px',
                        padding: '4px',
                        border: '1px solid #e2e8f0'
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                        {item.product.brand}
                      </div>
                      <Link
                        to={`/product/${item.product.id}`}
                        style={{
                          fontWeight: 800,
                          fontSize: '0.98rem',
                          color: '#0f172a',
                          display: 'block',
                          marginBottom: '4px',
                          textDecoration: 'none'
                        }}
                      >
                        {item.product.name}
                      </Link>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
                        <span style={{ color: '#475569', background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                          {item.product.unit}
                        </span>
                        <span style={{ fontWeight: 800, color: '#047857' }}>
                          ₹{unitPrice}
                        </span>
                        {item.product.discount > 0 && (
                          <span style={{ color: '#94a3b8', textDecoration: 'line-through', fontSize: '0.75rem' }}>
                            ₹{originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Stepper & Price */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: '#f1f5f9',
                        padding: '4px 8px',
                        borderRadius: '10px',
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          backgroundColor: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ fontWeight: 800, fontSize: '0.92rem', minWidth: '24px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          backgroundColor: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div style={{ minWidth: '90px', textAlign: 'right' }}>
                      <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#0f172a' }}>
                        ₹{itemTotal}
                      </div>
                      {itemSavings > 0 && (
                        <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>
                          Saved ₹{itemSavings}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      style={{
                        color: '#94a3b8',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                      title="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Order Summary & Checkout */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '100px' }}>
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginBottom: '16px' }}>
                Bill Details
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Items Total ({cartItems.length} items)</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>₹{subtotal}</span>
                </div>

                {productSavings > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: 700 }}>
                    <span>Store Wholesale Discount</span>
                    <span>- ₹{productSavings}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Truck size={15} color="#059669" />
                    <span>Delivery Charge</span>
                  </div>
                  <span style={{ fontWeight: 700, color: deliveryFee === 0 ? '#059669' : '#0f172a' }}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Handling & Packaging</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>₹{handlingFee}</span>
                </div>

                <div
                  style={{
                    borderTop: '1.5px solid #e2e8f0',
                    paddingTop: '14px',
                    marginTop: '6px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline'
                  }}
                >
                  <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#0f172a' }}>To Pay (COD)</span>
                  <span style={{ fontWeight: 900, fontSize: '1.45rem', color: '#047857' }}>₹{grandTotal}</span>
                </div>

                {totalSavings > 0 && (
                  <div
                    style={{
                      backgroundColor: '#dcfce7',
                      color: '#15803d',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      textAlign: 'center',
                      marginTop: '6px'
                    }}
                  >
                    🎉 You are saving ₹{totalSavings} on this Kirana order!
                  </div>
                )}

                {/* Cash on Delivery Badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 12px',
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '10px',
                    marginTop: '8px'
                  }}
                >
                  <Banknote size={18} color="#059669" />
                  <div style={{ fontSize: '0.8rem', color: '#065f46', fontWeight: 700 }}>
                    Pay ₹{grandTotal} in Cash / UPI to delivery bhaiya at doorstep
                  </div>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                onClick={() => navigate('/checkout')}
                className="btn btn-primary btn-lg"
                style={{
                  width: '100%',
                  marginTop: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px',
                  fontSize: '1rem',
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  boxShadow: '0 4px 14px rgba(5, 150, 105, 0.4)'
                }}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.75rem', color: '#64748b', marginTop: '12px' }}>
                <ShieldCheck size={14} color="#059669" />
                <span>100% Genuine Sealed Packaging</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
