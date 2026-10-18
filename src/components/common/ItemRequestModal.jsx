import React, { useState, useEffect } from 'react';
import { X, FileText, Send, CheckCircle2 } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { useAuth } from '../../context/AuthContext';

export const ItemRequestModal = ({ isOpen, onClose, initialItemName = '' }) => {
  const { addRequestedItem } = useInventory();
  const { user } = useAuth();

  const [itemName, setItemName] = useState(initialItemName);
  const [qty, setQty] = useState('1 unit');
  const [note, setNote] = useState('');
  const [customerName, setCustomerName] = useState(user?.name || 'Valued Customer');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+91 ');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialItemName) setItemName(initialItemName);
      if (user?.name) setCustomerName(user.name);
      if (user?.phone) setCustomerPhone(user.phone);
      setIsSubmitted(false);
    }
  }, [isOpen, initialItemName, user]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    addRequestedItem({
      name: itemName,
      qty,
      note,
      customerName,
      customerPhone
    });

    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
      setItemName('');
      setNote('');
      setIsSubmitted(false);
    }, 1500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1200 }}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '480px', padding: '28px', borderRadius: '18px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                Item Request Notepad
              </h3>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Item not in shop? Submit note to VK Kirana Storekeeper
              </div>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {isSubmitted ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <CheckCircle2 size={32} />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
              Request Note Submitted!
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Storekeeper has received your note for <strong>"{itemName}"</strong> and will stock it in shop soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Item Name / Grocery Details *
              </label>
              <input
                type="text"
                placeholder="e.g. Fortune Kachi Ghani Mustard Oil 5L, MDH Kitchen King"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
                autoFocus
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600 }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Quantity / Pack Size
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2 kg, 1 Jar, 5 Pkts"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Your Phone (Optional)
                </label>
                <input
                  type="text"
                  placeholder="+91 98765 00000"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.88rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Note for Shopkeeper (Brand preference, Urgency, etc.)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Please inform when available, needed before Friday"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.88rem', resize: 'vertical' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '6px', height: '42px', fontWeight: 800 }}>
              <Send size={16} />
              <span>Submit Note to Shopkeeper</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
