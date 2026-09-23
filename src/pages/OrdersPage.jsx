import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  Calendar,
  Clock,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export const OrdersPage = () => {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const { addToCart } = useCart();
  const { showSuccess } = useToast();
  const [filterStatus, setFilterStatus] = useState('all');

  const handleReorder = (order) => {
    order.items.forEach((item) => {
      addToCart(item.product, item.quantity);
    });
    showSuccess(`Added ${order.items.length} items from ${order.id} back into your cart!`);
    navigate('/cart');
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'all') return true;
    return o.status.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div style={{ padding: '30px 0 70px' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Page Title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
              My Orders & Receipts
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Review past grocery deliveries, track live status, or re-order essentials in 1-click
            </p>
          </div>

          {/* Status Filter Tabs */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'confirmed', 'delivered'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  border: filterStatus === st ? '1px solid #10b981' : '1px solid #e2e8f0',
                  backgroundColor: filterStatus === st ? '#ecfdf5' : '#ffffff',
                  color: filterStatus === st ? '#065f46' : '#64748b'
                }}
              >
                {st === 'all' ? 'All Orders' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <Package size={48} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#334155' }}>No orders found</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '6px', marginBottom: '20px' }}>
              You don't have any orders under this filter status.
            </p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredOrders.map((order) => (
              <div key={order.id} className="card" style={{ padding: '24px' }}>
                
                {/* Order Top Bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
                      Order #{order.id}
                    </div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: '20px',
                        backgroundColor: order.status === 'Delivered' ? '#dcfce7' : '#ecfdf5',
                        color: order.status === 'Delivered' ? '#15803d' : '#047857'
                      }}
                    >
                      ● {order.status}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.82rem', color: '#64748b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} />
                      <span>{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <Link to={`/order-success/${order.id}`} style={{ color: '#10b981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      View Receipt <ExternalLink size={13} />
                    </Link>
                  </div>
                </div>

                {/* Items in this order */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          style={{ width: '36px', height: '36px', objectFit: 'contain', background: '#f8fafc', borderRadius: '6px' }}
                        />
                        <div>
                          <span style={{ fontWeight: 600, color: '#1e293b' }}>{item.product.name}</span>
                          <span style={{ fontSize: '0.78rem', color: '#64748b', marginLeft: '6px' }}>({item.product.unit})</span>
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>
                        {item.quantity} x ₹{item.product.discountPrice || item.product.price}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Footer info & Re-order button */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '14px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Paid via {order.paymentMethod} • </span>
                    <strong style={{ fontSize: '1rem', color: '#0f172a' }}>Total: ₹{order.total}</strong>
                  </div>

                  <button
                    onClick={() => handleReorder(order)}
                    className="btn btn-secondary btn-sm"
                  >
                    <RotateCcw size={14} />
                    <span>Re-Order All Items</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
