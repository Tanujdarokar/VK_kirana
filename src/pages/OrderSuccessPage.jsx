import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Clock,
  Printer,
  ArrowRight,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';

export const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const { getOrderById, orders } = useOrders();

  const currentOrder = getOrderById(orderId) || orders[0];

  useEffect(() => {
    // Fire celebratory confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }
  }, []);

  if (!currentOrder) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '16px' }}>
          Return to Home
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: '780px' }}>
        
        {/* Success Hero Card */}
        <div
          className="card"
          style={{
            padding: '36px 28px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
            borderColor: '#bbf7d0',
            marginBottom: '28px'
          }}
        >
          <div style={{
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.35)'
          }}>
            <CheckCircle2 size={44} />
          </div>

          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#047857', background: '#dcfce7', padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase' }}>
            Payment Confirmed
          </span>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '12px 0 6px' }}>
            Order Placed Successfully!
          </h1>
          <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '16px' }}>
            Thank you for shopping with VKCommerce. Your groceries are being packed with care.
          </p>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#ffffff', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Order Reference ID:</span>
            <strong style={{ fontSize: '1rem', color: '#10b981', letterSpacing: '0.05em' }}>{currentOrder.id}</strong>
          </div>
        </div>

        {/* Live Delivery Tracker Timeline */}
        <div className="card" style={{ padding: '24px', marginBottom: '28px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px', color: '#0f172a' }}>
            Delivery Progress
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', textAlign: 'center', position: 'relative' }}>
            {/* Step 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={18} />
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Order Placed</div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Confirmed</div>
            </div>

            {/* Step 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Package size={18} />
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Packed</div>
              <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>At Dark Store</div>
            </div>

            {/* Step 3 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #cbd5e1' }}>
                <Truck size={18} />
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Out for Delivery</div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>In 10 Mins</div>
            </div>

            {/* Step 4 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #cbd5e1' }}>
                <CheckCircle2 size={18} />
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Delivered</div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>At Doorstep</div>
            </div>
          </div>
        </div>

        {/* Itemized Order Receipt */}
        <div className="card" style={{ padding: '28px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              Order Receipt & Items Summary
            </h3>
            <button
              onClick={handlePrint}
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Printer size={15} /> Print Invoice
            </button>
          </div>

          {/* Delivery & Customer metadata */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px', fontSize: '0.88rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>
                Delivering To:
              </div>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>{currentOrder.customer?.name}</div>
              <div style={{ color: '#475569' }}>{currentOrder.customer?.address?.street}</div>
              <div style={{ color: '#475569' }}>
                {currentOrder.customer?.address?.city}, {currentOrder.customer?.address?.state} - {currentOrder.customer?.address?.pincode}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '2px' }}>Phone: {currentOrder.customer?.phone}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>
                Delivery Slot & Payment:
              </div>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>{currentOrder.deliverySlot}</div>
              <div style={{ color: '#475569', marginTop: '4px' }}>Mode: <strong>{currentOrder.paymentMethod}</strong></div>
              <div style={{ color: '#10b981', fontWeight: 700, fontSize: '0.82rem', marginTop: '4px' }}>
                Status: {currentOrder.status}
              </div>
            </div>
          </div>

          {/* Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginBottom: '20px' }}>
            {currentOrder.items?.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={item.product.image} alt={item.product.name} style={{ width: '40px', height: '40px', objectFit: 'contain', background: '#f8fafc', borderRadius: '6px' }} />
                  <div>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.product.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.quantity} x ₹{item.product.discountPrice || item.product.price} ({item.product.unit})</div>
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>
                  ₹{(item.product.discountPrice || item.product.price) * item.quantity}
                </div>
              </div>
            ))}
          </div>

          {/* Totals Breakdown */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Subtotal</span>
              <span>₹{currentOrder.subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Delivery Fee</span>
              <span>{currentOrder.deliveryFee === 0 ? 'FREE' : `₹${currentOrder.deliveryFee}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Total Paid</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>₹{currentOrder.total}</span>
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
          <Link to="/orders" className="btn btn-secondary">
            <span>View All Orders</span>
          </Link>
          <Link to="/products" className="btn btn-primary">
            <span>Continue Shopping</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};
