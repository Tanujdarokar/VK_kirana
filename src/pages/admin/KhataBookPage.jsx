import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Send,
  X
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useFinance } from '../../context/FinanceContext';
import { useToast } from '../../context/ToastContext';

export const KhataBookPage = () => {
  const { khataCustomers, addKhataCustomer, addKhataEntry, totalUdhaarPending } = useFinance();
  const { showError, showSuccess } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState(khataCustomers[0]?.id || null);

  // Modals
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [entryType, setEntryType] = useState('udhaar'); // 'udhaar' (Gave Credit) | 'jama' (Got Payment)

  // Add Customer Form
  const [newCust, setNewCust] = useState({ name: '', phone: '', address: '', initialBalance: '' });

  // Add Entry Form
  const [entryAmount, setEntryAmount] = useState('');
  const [entryNote, setEntryNote] = useState('');

  const selectedCustomer = khataCustomers.find((c) => c.id === selectedCustomerId) || khataCustomers[0];

  const handleAddCustomerSubmit = (e) => {
    e.preventDefault();
    if (!newCust.name.trim() || !newCust.phone.trim()) {
      showError('Please provide customer name and phone number.');
      return;
    }
    const created = addKhataCustomer({
      name: newCust.name,
      phone: newCust.phone,
      address: newCust.address,
      initialBalance: Number(newCust.initialBalance || 0)
    });
    setSelectedCustomerId(created.id);
    setIsAddCustomerOpen(false);
    setNewCust({ name: '', phone: '', address: '', initialBalance: '' });
  };

  const handleAddEntrySubmit = (e) => {
    e.preventDefault();
    if (!entryAmount || Number(entryAmount) <= 0) {
      showError('Please enter a valid amount.');
      return;
    }
    addKhataEntry(selectedCustomer.id, {
      type: entryType,
      amount: Number(entryAmount),
      note: entryNote
    });
    setIsEntryModalOpen(false);
    setEntryAmount('');
    setEntryNote('');
  };

  const handleWhatsAppReminder = (customer) => {
    const text = `Namaste ${customer.name}, your total pending grocery balance at VK Kirana Store is Rs. ${customer.balance}. Please clear it at your earliest convenience or pay via UPI. Dhanyawad!`;
    const url = `https://wa.me/91${customer.phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    showSuccess('Opening WhatsApp reminder...');
  };

  const filteredCustomers = khataCustomers.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  return (
    <AdminLayout
      title="Customer Udhaar & Khata Book"
      subtitle="Track customer credit, record payments (Jama), and send payment reminders"
      actionButton={
        <button onClick={() => setIsAddCustomerOpen(true)} className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>Add New Customer</span>
        </button>
      }
    >
      {/* Top Overview Banner */}
      <div
        className="card"
        style={{
          padding: '20px 24px',
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)',
          borderColor: '#ffedd5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ea580c', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#c2410c', textTransform: 'uppercase' }}>
              Total Market Credit Outstanding
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#9a3412' }}>
              ₹{totalUdhaarPending.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.85rem', color: '#7c2d12', fontWeight: 600 }}>
          {khataCustomers.filter((c) => c.balance > 0).length} customers currently have pending dues
        </div>
      </div>

      {/* 2-Column Khata Layout: Customer List + Ledger View */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' }} className="khata-layout">
        
        {/* Left Column: Customers List */}
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ position: 'relative', marginBottom: '14px' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 32px', borderRadius: '8px', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '500px', overflowY: 'auto' }}>
            {filteredCustomers.map((cust) => {
              const isSelected = selectedCustomer?.id === cust.id;
              return (
                <div
                  key={cust.id}
                  onClick={() => setSelectedCustomerId(cust.id)}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    border: isSelected ? '1.5px solid #ea580c' : '1px solid #e2e8f0',
                    backgroundColor: isSelected ? '#fff7ed' : '#ffffff',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>{cust.name}</div>
                    <strong style={{ fontSize: '0.95rem', color: cust.balance > 0 ? '#ea580c' : '#10b981' }}>
                      ₹{cust.balance}
                    </strong>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Ph: {cust.phone} {cust.address ? `• ${cust.address}` : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Customer Ledger */}
        {selectedCustomer ? (
          <div className="card" style={{ padding: '24px' }}>
            
            {/* Customer Details Header & Quick Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
                  {selectedCustomer.name}
                </h2>
                <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                  Phone: <strong>{selectedCustomer.phone}</strong> {selectedCustomer.address ? `• ${selectedCustomer.address}` : ''}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Current Balance</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: selectedCustomer.balance > 0 ? '#ea580c' : '#10b981' }}>
                  ₹{selectedCustomer.balance}
                </div>
              </div>
            </div>

            {/* Action Buttons: Add Udhaar / Add Jama / WhatsApp Reminder */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <button
                onClick={() => { setEntryType('udhaar'); setIsEntryModalOpen(true); }}
                className="btn btn-sm"
                style={{ flex: 1, backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' }}
              >
                <ArrowUpRight size={16} />
                <span>+ Gave Udhaar (Credit)</span>
              </button>

              <button
                onClick={() => { setEntryType('jama'); setIsEntryModalOpen(true); }}
                className="btn btn-sm"
                style={{ flex: 1, backgroundColor: '#ecfdf5', color: '#059669', border: '1px solid #6ee7b7' }}
              >
                <ArrowDownRight size={16} />
                <span>+ Received Payment (Jama)</span>
              </button>

              {selectedCustomer.balance > 0 && (
                <button
                  onClick={() => handleWhatsAppReminder(selectedCustomer)}
                  className="btn btn-sm"
                  style={{ backgroundColor: '#25D366', color: 'white' }}
                >
                  <Send size={15} />
                  <span>WhatsApp Reminder</span>
                </button>
              )}
            </div>

            {/* Transaction Ledger Table */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '12px', color: '#0f172a' }}>
                Khata Entries & History
              </h3>

              {selectedCustomer.entries?.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                  No entries recorded for this customer yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedCustomer.entries.map((entry) => {
                    const isUdhaar = entry.type === 'udhaar';
                    return (
                      <div
                        key={entry.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 14px',
                          backgroundColor: isUdhaar ? '#fef2f2' : '#f0fdf4',
                          borderLeft: `4px solid ${isUdhaar ? '#ef4444' : '#10b981'}`,
                          borderRadius: '8px'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: isUdhaar ? '#991b1b' : '#065f46' }}>
                            {isUdhaar ? '🔴 Udhaar Given (Debit)' : '🟢 Payment Received (Jama)'}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#475569' }}>{entry.note}</div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <strong style={{ fontSize: '1.05rem', color: isUdhaar ? '#dc2626' : '#059669' }}>
                            {isUdhaar ? `+₹${entry.amount}` : `-₹${entry.amount}`}
                          </strong>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Add New Customer Modal */}
      {isAddCustomerOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddCustomerOpen(false)}>
          <div className="modal-card" style={{ maxWidth: '440px', padding: '24px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Add Khata Customer</h3>
              <button onClick={() => setIsAddCustomerOpen(false)} className="btn-icon"><X size={18} /></button>
            </div>

            <form onSubmit={handleAddCustomerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Customer Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Sharma, Verma Ji"
                  value={newCust.name}
                  onChange={(e) => setNewCust({ ...newCust, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Mobile Phone Number *</label>
                <input
                  type="tel"
                  placeholder="10 digit phone number"
                  value={newCust.phone}
                  onChange={(e) => setNewCust({ ...newCust, phone: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Address / Flat No. (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Flat 301, Green Apts"
                  value={newCust.address}
                  onChange={(e) => setNewCust({ ...newCust, address: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Opening Due Balance ₹ (If any)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={newCust.initialBalance}
                  onChange={(e) => setNewCust({ ...newCust, initialBalance: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', fontSize: '0.88rem' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
                Save Customer to Khata
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Entry Modal (Udhaar or Jama) */}
      {isEntryModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsEntryModalOpen(false)}>
          <div className="modal-card" style={{ maxWidth: '400px', padding: '24px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                {entryType === 'udhaar' ? '🔴 Record Udhaar Given' : '🟢 Record Payment Received (Jama)'}
              </h3>
              <button onClick={() => setIsEntryModalOpen(false)} className="btn-icon"><X size={18} /></button>
            </div>

            <form onSubmit={handleAddEntrySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Amount ₹ *</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={entryAmount}
                  onChange={(e) => setEntryAmount(e.target.value)}
                  required
                  autoFocus
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 800 }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Description / Note</label>
                <input
                  type="text"
                  placeholder="e.g. Atta 5kg + 1L Oil OR Cash Payment"
                  value={entryNote}
                  onChange={(e) => setEntryNote(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', fontSize: '0.88rem' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  marginTop: '8px',
                  backgroundColor: entryType === 'udhaar' ? '#dc2626' : '#10b981'
                }}
              >
                Save {entryType === 'udhaar' ? 'Udhaar Entry' : 'Payment Entry'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .khata-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </AdminLayout>
  );
};
