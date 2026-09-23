import React from 'react';
import { X, Printer, CheckCircle2, ShoppingBag } from 'lucide-react';

export const ReceiptModal = ({ transaction, isOpen, onClose }) => {
  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: '420px', padding: '24px', backgroundColor: '#ffffff', fontFamily: 'monospace' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981' }}>POS COUNTER RECEIPT</span>
          <button onClick={onClose} style={{ color: '#94a3b8' }}><X size={18} /></button>
        </div>

        {/* Receipt Body */}
        <div style={{ border: '1px dashed #cbd5e1', padding: '16px', borderRadius: '8px', backgroundColor: '#fafafa', marginBottom: '16px' }}>
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>VK KIRANA STORE</h2>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Daily Grocery & Fresh Staples</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Ph: 98765 43210 • Bengaluru</div>
          </div>

          <div style={{ borderTop: '1px dashed #cbd5e1', borderBottom: '1px dashed #cbd5e1', padding: '8px 0', margin: '8px 0', fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>Bill: #{transaction.id}</span>
            <span>{new Date(transaction.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          <div style={{ fontSize: '0.78rem', marginBottom: '8px' }}>
            Customer: <strong>{transaction.customerName}</strong>
          </div>

          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '10px 0', fontSize: '0.82rem' }}>
            {transaction.items?.map((it, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {it.quantity}x {it.product.name}
                </span>
                <span>₹{(it.product.discountPrice || it.product.price) * it.quantity}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '8px', marginTop: '10px', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.05rem', margin: '4px 0' }}>
              <span>NET TOTAL:</span>
              <span>₹{transaction.subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#475569' }}>
              <span>Mode: {transaction.paymentMethod?.toUpperCase()}</span>
              {transaction.paymentMethod === 'cash' && (
                <span>Received: ₹{transaction.amountPaid} (Change: ₹{transaction.changeReturned})</span>
              )}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.75rem', color: '#64748b' }}>
            *** Thank You, Visit Again! ***
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handlePrint} className="btn btn-primary" style={{ flex: 1 }}>
            <Printer size={16} />
            <span>Print Bill</span>
          </button>
          <button onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>
            Done / Next Bill
          </button>
        </div>
      </div>
    </div>
  );
};
