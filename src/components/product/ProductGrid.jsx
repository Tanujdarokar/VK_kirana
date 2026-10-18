import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import { PackageOpen, RotateCcw, FileText } from 'lucide-react';
import { ItemRequestModal } from '../common/ItemRequestModal';

export const ProductGrid = ({ products = [], loading = false, onResetFilters }) => {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="grid-responsive">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="card" style={{ padding: '14px', height: '320px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ height: '140px', backgroundColor: '#e2e8f0', borderRadius: '10px', animation: 'pulse 1.5s infinite' }} />
            <div style={{ height: '14px', width: '40%', backgroundColor: '#e2e8f0', borderRadius: '4px' }} />
            <div style={{ height: '20px', width: '80%', backgroundColor: '#e2e8f0', borderRadius: '4px' }} />
            <div style={{ height: '14px', width: '60%', backgroundColor: '#e2e8f0', borderRadius: '4px', marginTop: 'auto' }} />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <>
        <div
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px dashed #cbd5e1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PackageOpen size={32} color="#94a3b8" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#334155' }}>No products found</h3>
          <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '380px' }}>
            We couldn't find any groceries matching your filters or search criteria.
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '6px' }}>
            {onResetFilters && (
              <button onClick={onResetFilters} className="btn btn-secondary btn-sm">
                <RotateCcw size={15} />
                <span>Reset All Filters</span>
              </button>
            )}
            <button onClick={() => setIsRequestModalOpen(true)} className="btn btn-primary btn-sm">
              <FileText size={15} />
              <span>Add Item to Request Note</span>
            </button>
          </div>
        </div>

        <ItemRequestModal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="grid-responsive">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
