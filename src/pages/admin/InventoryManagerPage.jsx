import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Save,
  FileText,
  Check
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useInventory } from '../../context/InventoryContext';
import { categories } from '../../data/categories';
import { useToast } from '../../context/ToastContext';

export const InventoryManagerPage = () => {
  const {
    products,
    requestedItems,
    addProduct,
    updateProduct,
    deleteProduct,
    adjustStock,
    deleteRequestedItem,
    lowStockCount,
    outOfStockCount
  } = useInventory();
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

  const openAddModal = (presetName = '') => {
    setEditingItem(null);
    setFormData({
      name: presetName || '',
      category: 'dairy',
      brand: 'Local Kirana',
      unit: '1 unit',
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

      // Stock status
      if (stockFilter === 'low') {
        return p.stock > 0 && p.stock <= (p.minStockAlert || 5);
      }
      if (stockFilter === 'out') {
        return p.stock <= 0;
      }

      return true;
    });
  }, [products, searchQuery, selectedCategory, stockFilter]);

  return (
    <AdminLayout
      title="Kirana Item & Stock Inventory Manager"
      subtitle="Manage product retail prices, wholesale costs, stock levels, and add unlisted customer requests"
      actionButton={
        <button onClick={() => openAddModal()} className="btn btn-primary btn-sm">
          <Plus size={16} />
          <span>Add New Kirana Product</span>
        </button>
      }
    >
      {/* Customer Item Request Notes Banner */}
      {requestedItems.length > 0 && (
        <div
          className="card"
          style={{
            padding: '18px 20px',
            marginBottom: '24px',
            backgroundColor: '#f0fdf4',
            borderColor: '#bbf7d0'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.95rem', color: '#065f46' }}>
              <FileText size={18} color="#059669" />
              <span>Customer Missing Item Request Notes ({requestedItems.length})</span>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#059669', color: 'white', padding: '2px 8px', borderRadius: '12px' }}>
              Notepad
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {requestedItems.map((req) => (
              <div
                key={req.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#ffffff',
                  border: '1px solid #d1fae5',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                    "{req.name}" <span style={{ fontSize: '0.78rem', color: '#64748b' }}>({req.qty})</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '2px' }}>
                    Requested by <strong>{req.customerName}</strong> ({req.customerPhone || 'Walk-in'}) {req.note && `• Note: "${req.note}"`}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => {
                      openAddModal(req.name);
                      deleteRequestedItem(req.id);
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                  >
                    <Plus size={13} />
                    <span>Stock in Inventory</span>
                  </button>

                  <button
                    onClick={() => deleteRequestedItem(req.id)}
                    className="btn-icon"
                    style={{ width: '28px', height: '28px', color: '#94a3b8' }}
                    title="Dismiss note"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toolbar: Search & Stock Filters */}
      <div className="card" style={{ padding: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>

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

      {/* Product Inventory Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', color: '#64748b' }}>Item & Brand</th>
                <th style={{ padding: '12px 16px', color: '#64748b' }}>Aisle / Category</th>
                <th style={{ padding: '12px 16px', color: '#64748b' }}>Unit Size</th>
                <th style={{ padding: '12px 16px', color: '#64748b' }}>Cost Price</th>
                <th style={{ padding: '12px 16px', color: '#64748b' }}>Retail Price</th>
                <th style={{ padding: '12px 16px', color: '#64748b' }}>Shop Stock</th>
                <th style={{ padding: '12px 16px', color: '#64748b', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => {
                const sp = p.discountPrice || p.price;
                const cp = p.costPrice || Math.round(sp * 0.8);
                const isLow = p.stock > 0 && p.stock <= (p.minStockAlert || 5);
                const isOut = p.stock <= 0;

                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={p.image} alt={p.name} style={{ width: '36px', height: '36px', objectFit: 'contain', background: '#f8fafc', borderRadius: '6px' }} />
                        <div>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>{p.brand}</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '12px 16px', color: '#475569' }}>
                      {p.categoryName || p.category}
                    </td>

                    <td style={{ padding: '12px 16px', color: '#64748b' }}>
                      {p.unit}
                    </td>

                    <td style={{ padding: '12px 16px', color: '#64748b', fontWeight: 600 }}>
                      ₹{cp}
                    </td>

                    <td style={{ padding: '12px 16px', fontWeight: 800, color: '#0f172a' }}>
                      ₹{sp}
                      {p.price > sp && (
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8', textDecoration: 'line-through', marginLeft: '4px' }}>
                          ₹{p.price}
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            backgroundColor: isOut ? '#fef2f2' : isLow ? '#fffbeb' : '#f0fdf4',
                            color: isOut ? '#dc2626' : isLow ? '#d97706' : '#15803d'
                          }}
                        >
                          {p.stock} units
                        </span>

                        <div style={{ display: 'flex', gap: '2px' }}>
                          <button
                            onClick={() => adjustStock(p.id, -1)}
                            style={{ padding: '2px 6px', background: '#f1f5f9', borderRadius: '4px', fontWeight: 800, fontSize: '0.75rem' }}
                            title="Quick Stock -1"
                          >
                            -
                          </button>
                          <button
                            onClick={() => adjustStock(p.id, 1)}
                            style={{ padding: '2px 6px', background: '#f1f5f9', borderRadius: '4px', fontWeight: 800, fontSize: '0.75rem' }}
                            title="Quick Stock +1"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => openEditModal(p)}
                          className="btn-icon"
                          style={{ width: '30px', height: '30px', color: '#0284c7' }}
                          title="Edit Item details"
                        >
                          <Edit2 size={14} />
                        </button>

                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="btn-icon"
                          style={{ width: '30px', height: '30px', color: '#ef4444' }}
                          title="Delete Item from Inventory"
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
          <div className="modal-card" style={{ maxWidth: '520px', padding: '24px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                {editingItem ? 'Edit Kirana Product' : 'Add Kirana Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="btn-icon"><X size={18} /></button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Product Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fortune Chakki Fresh Atta 5kg"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  autoFocus
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Category / Aisle
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.85rem' }}
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Brand Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fortune, Amul, Tata"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Unit Size
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5 kg, 1 L"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Cost Price ₹
                  </label>
                  <input
                    type="number"
                    placeholder="Wholesale"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Selling Price ₹ *
                  </label>
                  <input
                    type="number"
                    placeholder="Retail Price"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value, price: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 800 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Initial Stock Count
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Min Stock Alert
                  </label>
                  <input
                    type="number"
                    value={formData.minStockAlert}
                    onChange={(e) => setFormData({ ...formData, minStockAlert: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Image URL
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', fontSize: '0.82rem' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
                <Save size={16} />
                <span>{editingItem ? 'Save Item Changes' : 'Add to Kirana Inventory'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
