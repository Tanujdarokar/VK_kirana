import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { categories } from '../data/categories';
import { useInventory } from '../context/InventoryContext';
import { ProductGrid } from '../components/product/ProductGrid';

export const CategoryPage = () => {
  const { products } = useInventory();
  const { category: categorySlug } = useParams();
  const [sortBy, setSortBy] = useState('popular');
  const [selectedBrand, setSelectedBrand] = useState('all');

  // Find category metadata
  const currentCategory = categories.find((c) => c.slug === categorySlug);

  // Filter products by category
  const categoryProducts = useMemo(() => {
    return products
      .filter((p) => p.category === categorySlug)
      .filter((p) => (selectedBrand === 'all' ? true : p.brand === selectedBrand))
      .sort((a, b) => {
        const priceA = a.discountPrice || a.price;
        const priceB = b.discountPrice || b.price;
        if (sortBy === 'price-low') return priceA - priceB;
        if (sortBy === 'price-high') return priceB - priceA;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      });
  }, [categorySlug, selectedBrand, sortBy]);

  // Unique brands in this category
  const categoryBrands = useMemo(() => {
    const list = products
      .filter((p) => p.category === categorySlug)
      .map((p) => p.brand);
    return ['all', ...new Set(list)];
  }, [categorySlug]);

  if (!currentCategory) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Category Not Found</h2>
        <p style={{ color: '#64748b', marginTop: '8px', marginBottom: '20px' }}>
          The requested category does not exist in our grocery aisles.
        </p>
        <Link to="/products" className="btn btn-primary">
          Browse All Products
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 0 60px' }}>
      <div className="container">
        
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#64748b', marginBottom: '16px' }}>
          <Link to="/" style={{ color: '#64748b' }}>Home</Link>
          <ChevronRight size={14} />
          <Link to="/products" style={{ color: '#64748b' }}>Categories</Link>
          <ChevronRight size={14} />
          <span style={{ color: '#0f172a', fontWeight: 700 }}>{currentCategory.name}</span>
        </div>

        {/* Category Hero Banner */}
        <div
          style={{
            background: `linear-gradient(135deg, ${currentCategory.color || '#ecfdf5'} 0%, #ffffff 100%)`,
            border: '1px solid #e2e8f0',
            borderRadius: '20px',
            padding: '28px 32px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            flexWrap: 'wrap'
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: currentCategory.accentColor || '#10b981',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '6px',
                display: 'inline-block'
              }}
            >
              Grocery Aisle
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              {currentCategory.name}
            </h1>
            <p style={{ fontSize: '0.95rem', color: '#475569', maxWidth: '540px' }}>
              {currentCategory.description}
            </p>
          </div>

          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            overflow: 'hidden',
            boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
            border: '3px solid white'
          }}>
            <img
              src={currentCategory.image}
              alt={currentCategory.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Brand Filter Bar & Sort Controls */}
        <div
          className="card"
          style={{
            padding: '12px 18px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px'
          }}
        >
          {/* Brand Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', padding: '2px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b' }}>Brands:</span>
            {categoryBrands.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBrand(b)}
                style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: selectedBrand === b ? '1px solid #10b981' : '1px solid #e2e8f0',
                  backgroundColor: selectedBrand === b ? '#ecfdf5' : '#ffffff',
                  color: selectedBrand === b ? '#065f46' : '#475569',
                  whiteSpace: 'nowrap'
                }}
              >
                {b === 'all' ? 'All Brands' : b}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                backgroundColor: '#f8fafc',
                fontWeight: 600
              }}
            >
              <option value="popular">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <ProductGrid products={categoryProducts} />
      </div>
    </div>
  );
};
