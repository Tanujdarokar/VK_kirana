import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Save
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useInventory } from '../../context/InventoryContext';
import { categories } from '../../data/categories';
import { useToast } from '../../context/ToastContext';

export const InventoryManagerPage = () => {
  const { products, addProduct, updateProduct, deleteProduct, adjustStock, lowStockCount, outOfStockCount } = useInventory();
  const { showError } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all'); // all | low | out

  // Modal State for Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'dairy',
    brand: 'Local Kirana',
    unit: '1 kg',
    costPrice: '',
    price: '',
    discountPrice: '',
    stock: 20,
    minStockAlert: 5,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    description: ''
  });

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'dairy',
      brand: 'Local Kirana',
      unit: '1 kg',
      costPrice: '',
      price: '',
      discountPrice: '',
      stock: 20,
      minStockAlert: 5,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
      description: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      brand: item.brand,
      unit: item.unit,
      costPrice: item.costPrice || Math.round((item.discountPrice || item.price) * 0.8),
      price: item.price,
      discountPrice: item.discountPrice || item.price,
      stock: item.stock,
      minStockAlert: item.minStockAlert || 5,
      image: item.image,
      description: item.description || ''
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.discountPrice) {
      showError('Please enter item name and selling price.');
      return;
    }

    const catObj = categories.find((c) => c.slug === formData.category);
    const categoryName = catObj ? catObj.name : 'Kirana';

    const payload = {
      ...formData,
      categoryName,
      costPrice: Number(formData.costPrice || Math.round(Number(formData.discountPrice) * 0.8)),
      price: Number(formData.price || formData.discountPrice),
      discountPrice: Number(formData.discountPrice),
      stock: Number(formData.stock),
      minStockAlert: Number(formData.minStockAlert)
    };

    if (editingItem) {
      updateProduct(editingItem.id, payload);
    } else {
      addProduct(payload);
    }

    setIsModalOpen(false);
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mName = p.name.toLowerCase().includes(q);
        const mBrand = p.brand.toLowerCase().includes(q);
        if (!mName && !mBrand) return false;
      }

      // Category
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Stock filter
      if (stockFilter === 'low' && (p.stock > (p.minStockAlert || 5) || p.stock === 0)) return false;
      if (stockFilter === 'out' && p.stock > 0) return false;

      return true;
    });
  }, [products, searchQuery, selectedCategory, stockFilter]);

  // Projected margin calculation for form
  const formSellingPrice = Number(formData.discountPrice || 0);
  const formCostPrice = Number(formData.costPrice || 0);
  const formProfit = formSellingPrice > 0 && formCostPrice > 0 ? formSellingPrice - formCostPrice : 0;
  const formMarginPercent = formSellingPrice > 0 ? Math.round((formProfit / formSellingPrice) * 100) : 0;

  return (
    <AdminLayout
      title="Kirana Item & Stock Inventory"
      subtitle="Manage wholesale purchase cost, retail selling prices, and live shelf stock counts"
      actionButton={
        <button onClick={openAddModal} className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>Add New Kirana Item</span>
        </button>
      }
    >
      {/* Search and Filters Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          
          {/* Search box */}
          <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: '360px' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search shop items by name or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '8px', fontSize: '0.88rem' }}
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ padding: '9px 12px', borderRadius: '8px', fontSize: '0.85rem', backgroundColor: '#f8fafc', fontWeight: 600 }}
          >
            <option value="all">All Aisles ({products.length})</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>

          {/* Stock Status Pills */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setStockFilter('all')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                backgroundColor: stockFilter === 'all' ? '#10b981' : '#f8fafc',
                color: stockFilter === 'all' ? 'white' : '#475569',
                border: '1px solid #e2e8f0'
              }}
            >
              All Items ({products.length})
            </button>
            <button
              onClick={() => setStockFilter('low')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                backgroundColor: stockFilter === 'low' ? '#f59e0b' : '#f8fafc',
                color: stockFilter === 'low' ? 'white' : '#d97706',
                border: '1px solid #e2e8f0'
              }}
            >
              Low Stock ({lowStockCount})
            </button>
            <button
              onClick={() => setStockFilter('out')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                backgroundColor: stockFilter === 'out' ? '#ef4444' : '#f8fafc',
                color: stockFilter === 'out' ? 'white' : '#dc2626',
                border: '1px solid #e2e8f0'
              }}
            >
              Out of Stock ({outOfStockCount})
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Items Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', color: '#64748b' }}>Product Item</th>
                <th style={{ padding: '12px 14px', color: '#64748b' }}>Category</th>
                <th style={{ padding: '12px 14px', color: '#64748b' }}>Cost Price (CP)</th>
                <th style={{ padding: '12px 14px', color: '#64748b' }}>Sell Price (SP)</th>
                <th style={{ padding: '12px 14px', color: '#64748b' }}>Profit Margin</th>
                <th style={{ padding: '12px 14px', color: '#64748b', textAlign: 'center' }}>Live Stock Count</th>
                <th style={{ padding: '12px 16px', color: '#64748b', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => {
                const sp = p.discountPrice || p.price;
                const cp = p.costPrice || Math.round(sp * 0.8);
                const profit = sp - cp;
                const marginPct = sp > 0 ? Math.round((profit / sp) * 100) : 0;
                const isLow = p.stock > 0 && p.stock <= (p.minStockAlert || 5);
                const isOut = p.stock === 0;

                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    
                    {/* Item */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={p.image}
                          alt={p.name}
                          style={{ width: '38px', height: '38px', objectFit: 'contain', background: '#f8fafc', borderRadius: '6px', padding: '2px' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {p.brand} • <strong style={{ color: '#059669' }}>{p.unit}</strong>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '12px 14px', color: '#475569', fontSize: '0.82rem' }}>
                      {p.categoryName}
                    </td>

                    {/* Cost Price */}
                    <td style={{ padding: '12px 14px', color: '#475569', fontWeight: 600 }}>
                      ₹{cp}
                    </td>

                    {/* Sell Price */}
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: '#0f172a' }}>
                      ₹{sp}
                      {p.price > sp && (
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8', textDecoration: 'line-through', marginLeft: '4px' }}>
                          ₹{p.price}
                        </span>
                      )}
                    </td>

                    {/* Profit Margin */}
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#047857' }}>
                        +₹{profit} ({marginPct}%)
                      </span>
                    </td>

                    {/* Stock Quick Controls */}
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => adjustStock(p.id, -1)}
                          style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#f1f5f9', fontWeight: 800, color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          -
                        </button>
                        <span
                          style={{
                            fontWeight: 800,
                            fontSize: '0.9rem',
                            minWidth: '28px',
                            color: isOut ? '#ef4444' : isLow ? '#d97706' : '#0f172a'
                          }}
                        >
                          {p.stock}
                        </span>
                        <button
                          onClick={() => adjustStock(p.id, 1)}
                          style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#f1f5f9', fontWeight: 800, color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          +
                        </button>
                      </div>
                      {isLow && (
                        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#d97706', marginTop: '2px' }}>
                          ⚠️ Low Stock
                        </div>
                      )}
                      {isOut && (
                        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#ef4444', marginTop: '2px' }}>
                          ⛔ Empty
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => openEditModal(p)}
                          className="btn-icon"
                          style={{ width: '32px', height: '32px' }}
                          title="Edit Item Details"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="btn-icon"
                          style={{ width: '32px', height: '32px', color: '#ef4444' }}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-card"
            style={{ maxWidth: '560px', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {editingItem ? 'Edit Kirana Item' : 'Add New Item to Shop'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Item Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Madhur Pure Crystal Sugar, Tata Salt, Ghee"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Category Aisle *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.88rem' }}
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Brand
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Amul, India Gate, Loose Kirana"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Unit / Packing Weight *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1 kg, 500 g, 1 L, 1 Pkt"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Wholesale Cost Price (CP) ₹
                  </label>
                  <input
                    type="number"
                    placeholder="Your purchase cost"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Selling Price (Discount/Retail) ₹ *
                  </label>
                  <input
                    type="number"
                    placeholder="Price to customer"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Printed MRP ₹ (Optional)
                  </label>
                  <input
                    type="number"
                    placeholder="Printed box MRP"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              {/* Live Profit Margin Calculator Preview */}
              {formSellingPrice > 0 && formCostPrice > 0 && (
                <div style={{ padding: '10px 14px', backgroundColor: '#ecfdf5', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: 700, color: '#065f46' }}>Calculated Profit per Unit:</span>
                  <strong style={{ color: '#047857', fontSize: '1rem' }}>+₹{formProfit} ({formMarginPercent}% margin)</strong>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Stock Available in Shop *
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Low Stock Warning Limit
                  </label>
                  <input
                    type="number"
                    value={formData.minStockAlert}
                    onChange={(e) => setFormData({ ...formData, minStockAlert: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  <Save size={16} />
                  <span>{editingItem ? 'Save Item Changes' : 'Add to Inventory'}</span>
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline" style={{ flex: 1 }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
