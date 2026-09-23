import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Banknote,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';

const INDIAN_STATES = [
  'Karnataka',
  'Maharashtra',
  'Delhi NCR',
  'Telangana',
  'Tamil Nadu',
  'Gujarat',
  'Uttar Pradesh',
  'West Bengal',
  'Rajasthan',
  'Madhya Pradesh',
  'Punjab',
  'Haryana',
  'Kerala',
  'Andhra Pradesh',
  'Bihar',
  'Odisha',
  'Assam',
  'Jharkhand',
  'Chhattisgarh',
  'Uttarakhand',
  'Himachal Pradesh',
  'Goa',
  'Chandigarh',
  'Jammu and Kashmir',
  'Tripura',
  'Puducherry'
];

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, subtotal, originalSubtotal, deliveryFee, handlingFee, grandTotal, totalSavings } = useCart();
  const { user } = useAuth();
  const { placeOrder } = useOrders();
  const { showError, showSuccess } = useToast();

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || 'Tanuj Sharma',
    phone: user?.phone || '+91 98765 43210',
    email: user?.email || 'tanuj@example.com',
    street: user?.address?.street || 'Flat 402, Green Meadows Residency, Sector 45',
    city: user?.address?.city || 'Bengaluru',
    state: user?.address?.state || 'Karnataka',
    pincode: user?.address?.pincode || '560034',
    deliveryNote: 'Please ring the doorbell and hand over to security if not available.'
  });

  const [deliverySlot, setDeliverySlot] = useState('Express 15-30 Mins (Superfast)');
  const [isProcessing, setIsProcessing] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Your Kirana Cart is Empty</h2>
        <p style={{ color: '#64748b', marginTop: '8px', marginBottom: '20px' }}>
          Please add grocery items to your cart before proceeding to checkout.
        </p>
        <Link to="/products" className="btn btn-primary">
          Explore Groceries
        </Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    // Basic Validation
    if (!formData.name.trim() || !formData.phone.trim() || !formData.street.trim() || !formData.pincode.trim()) {
      showError('Please fill in all mandatory delivery address fields.');
      return;
    }

    if (formData.pincode.length !== 6 || !/^\d+$/.test(formData.pincode)) {
      showError('Please enter a valid 6-digit Indian pincode.');
      return;
    }

    setIsProcessing(true);

    // Simulate order placement processing
    setTimeout(() => {
      const orderPayload = {
        customer: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode
          }
        },
        deliverySlot,
        deliveryNote: formData.deliveryNote,
        items: cartItems,
        paymentMethod: 'Cash on Delivery (COD)',
        subtotal,
        originalSubtotal,
        discount: 0,
        deliveryFee,
        handlingFee,
        total: grandTotal
      };

      const newOrder = placeOrder(orderPayload);
      setIsProcessing(false);
      showSuccess(`Order placed successfully with Cash on Delivery! Order #${newOrder.id}`);
      navigate(`/order-success/${newOrder.id}`);
    }, 1000);
  };

  return (
    <div style={{ padding: '30px 0 70px' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a' }}>
            Kirana Order Checkout
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Enter your delivery address and confirm your Cash on Delivery (COD) order
          </p>
        </div>

        {/* 2-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px', alignItems: 'start' }} className="checkout-layout">
          
          {/* Left Column: Delivery Details & COD Payment */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Step 1: Delivery Address */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#059669', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                  1
                </div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                  Delivery Address & Contact
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Customer Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Mobile Number (+91 format) *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Email Address (For Bill & Tax Invoice)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Flat / House No., Apartment, Street & Landmark *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="e.g. Flat 402, Green Meadows Residency, Sector 45"
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    City / Town *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.88rem', backgroundColor: '#ffffff' }}
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    6-Digit Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="e.g. 560034"
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Delivery Instructions for Delivery Bhaiya
                  </label>
                  <input
                    type="text"
                    name="deliveryNote"
                    value={formData.deliveryNote}
                    onChange={handleInputChange}
                    placeholder="e.g. Please ring the doorbell, or leave at gate security"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Slot Selector */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#059669', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                  2
                </div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                  Select Kirana Delivery Slot
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                {[
                  { title: 'Express 15-30 Mins (Superfast)', time: 'Arriving in 15-30 Mins', badge: 'Instant' },
                  { title: 'Morning Slot (7:00 AM - 10:00 AM)', time: 'Fresh morning milk & bread', badge: 'Slot 1' },
                  { title: 'Afternoon Slot (1:00 PM - 4:00 PM)', time: 'Midday pantry delivery', badge: 'Slot 2' },
                  { title: 'Evening Slot (6:00 PM - 9:00 PM)', time: 'Evening dinner ration', badge: 'Slot 3' }
                ].map((slot) => {
                  const isSelected = deliverySlot === slot.title;
                  return (
                    <div
                      key={slot.title}
                      onClick={() => setDeliverySlot(slot.title)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #059669' : '1px solid #e2e8f0',
                        backgroundColor: isSelected ? '#ecfdf5' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857' }}>{slot.badge}</span>
                        {isSelected && <CheckCircle2 size={16} color="#059669" />}
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a', marginBottom: '2px' }}>
                        {slot.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{slot.time}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Cash on Delivery Payment Only */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#059669', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                  3
                </div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                  Payment Method: Cash on Delivery (COD)
                </h2>
              </div>

              <div
                style={{
                  backgroundColor: '#f0fdf4',
                  border: '2px solid #10b981',
                  borderRadius: '16px',
                  padding: '24px',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: '#059669',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 10px rgba(5, 150, 105, 0.3)'
                      }}
                    >
                      <Banknote size={24} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#065f46' }}>
                        Cash on Delivery (COD)
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#047857' }}>
                        Zero prepayment required • Pay at your doorstep
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      background: '#dcfce7',
                      color: '#15803d',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: '20px',
                      border: '1px solid #86efac'
                    }}
                  >
                    ✓ Default Selection
                  </span>
                </div>

                <p style={{ fontSize: '0.88rem', color: '#166534', lineHeight: 1.6, margin: '0 0 12px' }}>
                  You can pay <strong>₹{grandTotal}</strong> in cash or scan the delivery executive's UPI QR code directly on delivery. No online payment needed beforehand.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem', color: '#15803d', fontWeight: 700, flexWrap: 'wrap' }}>
                  <span>✓ 100% Safe & Trusted</span>
                  <span>✓ Inspect Groceries on Doorstep</span>
                  <span>✓ Exact Change / UPI Accepted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '100px' }}>
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', marginBottom: '16px' }}>
                Kirana Bill Summary
              </h3>

              {/* Items List Preview */}
              <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', paddingRight: '4px' }}>
                {cartItems.map((item) => {
                  const price = item.product.discountPrice || item.product.price;
                  return (
                    <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <div style={{ color: '#334155', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.quantity}x {item.product.name}
                      </div>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>
                        ₹{price * item.quantity}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Item Subtotal ({cartItems.length} items)</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>₹{subtotal}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>15-Min Delivery Fee</span>
                  <span style={{ fontWeight: 600, color: deliveryFee === 0 ? '#059669' : '#0f172a' }}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Handling & Packing</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>₹{handlingFee}</span>
                </div>

                <div style={{ borderTop: '1.5px solid #e2e8f0', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#0f172a' }}>Total Amount To Pay</span>
                  <span style={{ fontWeight: 900, fontSize: '1.45rem', color: '#047857' }}>₹{grandTotal}</span>
                </div>

                {totalSavings > 0 && (
                  <div style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '6px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, textAlign: 'center', marginTop: '4px' }}>
                    🎉 You are saving ₹{totalSavings} on this Kirana order!
                  </div>
                )}
              </div>

              {/* Place Order CTA Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
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
                {isProcessing ? (
                  <span>Confirming Order...</span>
                ) : (
                  <>
                    <Lock size={18} />
                    <span>Place Order (Cash on Delivery ₹{grandTotal})</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.75rem', color: '#64748b', marginTop: '12px' }}>
                <ShieldCheck size={14} color="#059669" />
                <span>100% Safe & Secure Kirana Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
