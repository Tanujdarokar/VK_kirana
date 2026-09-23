import React, { useState, useMemo } from 'react';
import {
  Search,
  Banknote,
  QrCode,
  BookOpen,
  CheckCircle2,
  X
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useInventory } from '../../context/InventoryContext';
import { useFinance } from '../../context/FinanceContext';
import { useToast } from '../../context/ToastContext';
import { ReceiptModal } from '../../components/admin/ReceiptModal';
import { categories } from '../../data/categories';

export const PosBillingPage = () => {
  const { products } = useInventory();
  const { recordPosSale, khataCustomers } = useFinance();
  const { showError } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  // POS Cart State
  const [billItems, setBillItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [customerType, setCustomerType] = useState('walkin'); // 'walkin' | 'khata'
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [selectedKhataCustomer, setSelectedKhataCustomer] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' | 'upi' | 'udhaar'
  const [cashTendered, setCashTendered] = useState('');

  // Receipt Modal State
  const [latestTxn, setLatestTxn] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Filter products for quick selection
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCat !== 'all' && p.category !== selectedCat) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
      }
      return true;
    });
  }, [products, selectedCat, searchQuery]);

  // Add item to bill
  const addItemToBill = (product) => {
    if (product.stock <= 0) {
      showError(`${product.name} is currently out of stock!`);
      return;
    }

    setBillItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          showError(`Only ${product.stock} items in shop stock`);
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateBillQty = (productId, qty) => {
    if (qty <= 0) {
      setBillItems((prev) => prev.filter((i) => i.product.id !== productId));
      return;
    }
    const product = products.find((p) => p.id === productId);
    if (product && qty > product.stock) {
      showError(`Only ${product.stock} items in stock`);
      return;
    }
    setBillItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i))
    );
  };

  const removeBillItem = (productId) => {
    setBillItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const clearBill = () => {
    setBillItems([]);
    setDiscount(0);
    setCashTendered('');
  };

  // Bill totals
  const subtotal = billItems.reduce(
    (sum, it) => sum + (it.product.discountPrice || it.product.price) * it.quantity,
    0
  );
  const netTotal = Math.max(0, subtotal - Number(discount || 0));
  const changeDue = paymentMethod === 'cash' && Number(cashTendered) > netTotal ? Number(cashTendered) - netTotal : 0;

  // Complete & Record POS Bill
  const handleCompleteBill = () => {
    if (billItems.length === 0) {
      showError('Please add items to bill before completing sale.');
      return;
    }

    let finalCustName = customerName;
    let finalCustId = null;

    if (customerType === 'khata') {
      if (!selectedKhataCustomer) {
        showError('Please select a Khata customer to record Udhaar.');
        return;
      }
      const cust = khataCustomers.find((c) => c.id === selectedKhataCustomer);
      finalCustName = cust ? cust.name : customerName;
      finalCustId = selectedKhataCustomer;
    }

    const txn = recordPosSale({
      items: billItems,
      customerName: finalCustName,
      customerId: finalCustId,
      paymentMethod,
      amountPaid: paymentMethod === 'cash' ? Number(cashTendered || netTotal) : netTotal,
      discount: Number(discount || 0)
    });

    setLatestTxn(txn);
    setIsReceiptOpen(true);
    clearBill();
  };

  return (
    <AdminLayout
      title="POS Counter Billing"
      subtitle="Superfast counter checkout for walk-in and regular customer sales"
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px', alignItems: 'start' }} className="pos-layout">
        
        {/* Left: Product Selector Grid */}
        <div>
          {/* Search and Category Quick Pills */}
          <div className="card" style={{ padding: '16px', marginBottom: '16px' }}>
            <div style={{ position: 'relative', marginBottom: '12px' }}>
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search item (e.g. Milk, Atta, Basmati, Chips, Sugar)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '8px', fontSize: '0.9rem' }}
              />
            </div>

            {/* Category pills */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
              <button
                onClick={() => setSelectedCat('all')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  backgroundColor: selectedCat === 'all' ? '#10b981' : '#f1f5f9',
                  color: selectedCat === 'all' ? 'white' : '#475569'
                }}
              >
                All Items
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCat(cat.slug)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    backgroundColor: selectedCat === cat.slug ? '#10b981' : '#f1f5f9',
                    color: selectedCat === cat.slug ? 'white' : '#475569'
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Fast Click Tiles */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '12px',
            maxHeight: '560px',
            overflowY: 'auto'
          }}>
            {filteredProducts.map((product) => {
              const sp = product.discountPrice || product.price;
              const isOut = product.stock <= 0;

              return (
                <div
                  key={product.id}
                  onClick={() => !isOut && addItemToBill(product)}
                  className="card"
                  style={{
                    padding: '12px',
                    cursor: isOut ? 'not-allowed' : 'pointer',
                    opacity: isOut ? 0.6 : 1,
                    textAlign: 'center',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                    <img src={product.image} alt={product.name} style={{ maxHeight: '50px', objectFit: 'contain' }} />
                  </div>

                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0f172a', lineHeight: 1.2, height: '2rem', overflow: 'hidden' }}>
                    {product.name}
                  </div>

                  <div style={{ fontSize: '0.72rem', color: '#64748b', margin: '2px 0' }}>
                    {product.unit}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #f1f5f9' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#10b981' }}>₹{sp}</span>
                    <span style={{ fontSize: '0.7rem', color: isOut ? '#ef4444' : '#64748b', fontWeight: 600 }}>
                      {isOut ? 'Empty' : `${product.stock} left`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Current Active Counter Bill */}
        <div className="card" style={{ padding: '20px', position: 'sticky', top: '80px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
              Current Bill ({billItems.length} items)
            </h3>
            {billItems.length > 0 && (
              <button onClick={clearBill} style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: 700 }}>
                Clear
              </button>
            )}
          </div>

          {/* Customer Type Selector */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <button
                type="button"
                onClick={() => { setCustomerType('walkin'); setPaymentMethod('cash'); }}
                style={{
                  flex: 1,
                  padding: '6px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  border: customerType === 'walkin' ? '1px solid #10b981' : '1px solid #e2e8f0',
                  backgroundColor: customerType === 'walkin' ? '#ecfdf5' : '#ffffff',
                  color: customerType === 'walkin' ? '#065f46' : '#64748b'
                }}
              >
                Walk-in Customer
              </button>
              <button
                type="button"
                onClick={() => { setCustomerType('khata'); setPaymentMethod('udhaar'); }}
                style={{
                  flex: 1,
                  padding: '6px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  border: customerType === 'khata' ? '1px solid #ea580c' : '1px solid #e2e8f0',
                  backgroundColor: customerType === 'khata' ? '#fff7ed' : '#ffffff',
                  color: customerType === 'khata' ? '#c2410c' : '#64748b'
                }}
              >
                Udhaar / Khata Customer
              </button>
            </div>

            {customerType === 'walkin' ? (
              <input
                type="text"
                placeholder="Customer Name (Optional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', fontSize: '0.82rem' }}
              />
            ) : (
              <select
                value={selectedKhataCustomer}
                onChange={(e) => setSelectedKhataCustomer(e.target.value)}
                style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 600 }}
              >
                <option value="">Select Khata Account...</option>
                {khataCustomers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} (Pending Due: ₹{c.balance})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Items In Bill List */}
          <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px', paddingRight: '4px' }}>
            {billItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8', fontSize: '0.85rem' }}>
                Click items on the left to add to bill
              </div>
            ) : (
              billItems.map(({ product, quantity }) => {
                const sp = product.discountPrice || product.price;
                return (
                  <div key={product.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '0.82rem' }}>
                    <div style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{product.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>₹{sp} x {quantity}</div>
                    </div>

                    {/* Qty controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button onClick={() => updateBillQty(product.id, quantity - 1)} style={{ width: '22px', height: '22px', background: '#e2e8f0', borderRadius: '4px', fontWeight: 800 }}>-</button>
                      <span style={{ fontWeight: 700, minWidth: '18px', textAlign: 'center' }}>{quantity}</span>
                      <button onClick={() => updateBillQty(product.id, quantity + 1)} style={{ width: '22px', height: '22px', background: '#e2e8f0', borderRadius: '4px', fontWeight: 800 }}>+</button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <strong style={{ fontSize: '0.88rem' }}>₹{sp * quantity}</strong>
                      <button onClick={() => removeBillItem(product.id)} style={{ color: '#ef4444' }}><X size={14} /></button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Payment Method Selector */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginBottom: '14px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
              Select Payment Mode:
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  border: paymentMethod === 'cash' ? '2px solid #10b981' : '1px solid #e2e8f0',
                  backgroundColor: paymentMethod === 'cash' ? '#ecfdf5' : '#ffffff',
                  color: paymentMethod === 'cash' ? '#065f46' : '#475569'
                }}
              >
                <Banknote size={14} /> Cash
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  border: paymentMethod === 'upi' ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                  backgroundColor: paymentMethod === 'upi' ? '#eff6ff' : '#ffffff',
                  color: paymentMethod === 'upi' ? '#1d4ed8' : '#475569'
                }}
              >
                <QrCode size={14} /> UPI / QR
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('udhaar')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  border: paymentMethod === 'udhaar' ? '2px solid #ea580c' : '1px solid #e2e8f0',
                  backgroundColor: paymentMethod === 'udhaar' ? '#fff7ed' : '#ffffff',
                  color: paymentMethod === 'udhaar' ? '#c2410c' : '#475569'
                }}
              >
                <BookOpen size={14} /> Udhaar
              </button>
            </div>

            {/* Cash Tendered & Change Calculation */}
            {paymentMethod === 'cash' && (
              <div style={{ marginTop: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="number"
                  placeholder="Cash Given (₹)"
                  value={cashTendered}
                  onChange={(e) => setCashTendered(e.target.value)}
                  style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', fontSize: '0.85rem' }}
                />
                {changeDue > 0 && (
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981' }}>
                    Return: ₹{changeDue}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Bill Summary & Complete Sale Button */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
              <span style={{ fontSize: '1rem', fontWeight: 800 }}>Total Payable</span>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981' }}>₹{netTotal}</span>
            </div>

            <button
              onClick={handleCompleteBill}
              disabled={billItems.length === 0}
              className="btn btn-primary"
              style={{ width: '100%', height: '46px', fontSize: '1rem', fontWeight: 800 }}
            >
              <CheckCircle2 size={18} />
              <span>Complete Sale (₹{netTotal})</span>
            </button>
          </div>
        </div>
      </div>

      {/* POS Receipt Modal */}
      <ReceiptModal
        transaction={latestTxn}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />

      <style>{`
        @media (max-width: 900px) {
          .pos-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </AdminLayout>
  );
};
