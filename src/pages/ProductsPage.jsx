import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  SlidersHorizontal,
  X,
  Star,
  ChevronDown,
  RotateCcw,
  Search,
  Check,
  Grid,
  List
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { brands } from '../data/products';
import { categories } from '../data/categories';
import { getExpandedSearchTerms } from '../data/aiAssistant';
import { ProductCard } from '../components/product/ProductCard';
import { ProductGrid } from '../components/product/ProductGrid';

export const ProductsPage = () => {
  const { products } = useInventory();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';

  // Local Filter States
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [minRating, setMinRating] = useState(0);
  const [minDiscount, setMinDiscount] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sync URL params to local state
  useEffect(() => {
    setSearchQuery(searchParam);
  }, [searchParam]);

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedBrands([]);
    setMaxPrice(1000);
    setMinRating(0);
    setMinDiscount(0);
    setInStockOnly(false);
    setSortBy('popular');
    setSearchParams({});
  };

  const handleBrandToggle = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search Query (with AI Hindi/Hinglish Synonyms support)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const expandedTerms = getExpandedSearchTerms(q);
          const haystack = [p.name, p.brand, p.categoryName, p.description || '', p.unit || ''].join(' ').toLowerCase();

          const matchesDirect = haystack.includes(q);
          const matchesExpanded = expandedTerms.some((term) => haystack.includes(term));

          if (!matchesDirect && !matchesExpanded) return false;
        }

        // Category Filter
        if (selectedCategory && p.category !== selectedCategory) {
          return false;
        }

        // Brand Filter
        if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
          return false;
        }

        // Price Filter
        const activePrice = p.discountPrice || p.price;
        if (activePrice > maxPrice) {
          return false;
        }

        // Rating Filter
        if (minRating > 0 && p.rating < minRating) {
          return false;
        }

        // Discount Filter
        if (minDiscount > 0 && p.discount < minDiscount) {
          return false;
        }

        // In Stock Filter
        if (inStockOnly && p.stock <= 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.discountPrice || a.price;
        const priceB = b.discountPrice || b.price;

        if (sortBy === 'price-low') return priceA - priceB;
        if (sortBy === 'price-high') return priceB - priceA;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'discount') return b.discount - a.discount;
        return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      });
  }, [products, searchQuery, selectedCategory, selectedBrands, maxPrice, minRating, minDiscount, inStockOnly, sortBy]);

  // Sidebar Filter JSX component
  const filterSidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* Search within Results */}
      <div>
        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '8px' }}>
          Search Catalog
        </label>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '8px 10px 8px 32px', borderRadius: '8px', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '10px' }}>
          Categories
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
          <div
            onClick={() => setSelectedCategory('')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 8px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              backgroundColor: selectedCategory === '' ? '#ecfdf5' : 'transparent',
              color: selectedCategory === '' ? '#065f46' : '#475569',
              fontWeight: selectedCategory === '' ? 700 : 500
            }}
          >
            <span>All Categories</span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{products.length}</span>
          </div>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            const count = products.filter((p) => p.category === cat.slug).length;
            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? '' : cat.slug)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  backgroundColor: isSelected ? '#ecfdf5' : 'transparent',
                  color: isSelected ? '#065f46' : '#475569',
                  fontWeight: isSelected ? 700 : 500
                }}
              >
                <span>{cat.name}</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Max Price Slider */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Max Price</label>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10b981' }}>Up to ₹{maxPrice}</span>
        </div>
        <input
          type="range"
          min="40"
          max="1000"
          step="20"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
          <span>₹40</span>
          <span>₹500</span>
          <span>₹1000</span>
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '8px' }}>
          Customer Rating
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[
            { val: 0, label: 'All Ratings' },
            { val: 4.8, label: '4.8 ★ & Above (Top Rated)' },
            { val: 4.5, label: '4.5 ★ & Above' },
            { val: 4.0, label: '4.0 ★ & Above' }
          ].map((item) => (
            <label
              key={item.val}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.82rem',
                color: '#475569',
                cursor: 'pointer'
              }}
            >
              <input
                type="radio"
                name="ratingFilter"
                checked={minRating === item.val}
                onChange={() => setMinRating(item.val)}
                style={{ accentColor: '#10b981' }}
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Minimum Discount */}
      <div>
        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '8px' }}>
          Discount
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[
            { val: 0, label: 'All Items' },
            { val: 10, label: '10% or more' },
            { val: 15, label: '15% or more' },
            { val: 20, label: '20% or more (Mega Saver)' }
          ].map((item) => (
            <label
              key={item.val}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.82rem',
                color: '#475569',
                cursor: 'pointer'
              }}
            >
              <input
                type="radio"
                name="discountFilter"
                checked={minDiscount === item.val}
                onChange={() => setMinDiscount(item.val)}
                style={{ accentColor: '#10b981' }}
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Popular Brands */}
      <div>
        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '8px' }}>
          Brands
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
          {brands.map((b) => (
            <label
              key={b}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.82rem',
                color: '#475569',
                cursor: 'pointer'
              }}
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(b)}
                onChange={() => handleBrandToggle(b)}
                style={{ accentColor: '#10b981' }}
              />
              <span>{b}</span>
            </label>
          ))}
        </div>
      </div>

      {/* In Stock Only Checkbox */}
      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600, color: '#1e293b', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            style={{ accentColor: '#10b981' }}
          />
          <span>In-Stock Items Only</span>
        </label>
      </div>

      {/* Reset Button */}
      <button onClick={handleResetFilters} className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: '8px' }}>
        <RotateCcw size={14} />
        <span>Reset Filters</span>
      </button>
    </div>
  );

  return (
    <div style={{ padding: '30px 0 60px' }}>
      <div className="container">
        
        {/* Page Header & Breadcrumb */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#64748b', marginBottom: '6px' }}>
            <span>Home</span>
            <span>/</span>
            <span style={{ color: '#0f172a', fontWeight: 600 }}>Products Catalog</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
            Explore Groceries
          </h1>
        </div>

        {/* Main 2-Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '28px', alignItems: 'start' }} className="catalog-layout">
          
          {/* Desktop Left Sidebar Filter Card */}
          <aside className="card hide-on-mobile" style={{ padding: '20px', position: 'sticky', top: '100px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.95rem' }}>
                <Filter size={18} color="#10b981" />
                <span>Filter Items</span>
              </div>
              <button onClick={handleResetFilters} style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                Clear All
              </button>
            </div>
            {filterSidebarContent}
          </aside>

          {/* Right Product Grid Column */}
          <div>
            
            {/* Top Toolbar: Active Filters, Results Count & Sorting */}
            <div
              className="card"
              style={{
                padding: '14px 18px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="btn btn-outline btn-sm show-on-mobile"
                  style={{ display: 'none' }}
                >
                  <SlidersHorizontal size={15} />
                  <span>Filters</span>
                </button>

                <span style={{ fontSize: '0.9rem', color: '#475569' }}>
                  Showing <strong>{filteredProducts.length}</strong> products
                </span>
              </div>

              {/* Sort By Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    backgroundColor: '#f8fafc',
                    cursor: 'pointer'
                  }}
                >
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="discount">Biggest Discount</option>
                </select>
              </div>
            </div>

            {/* Active Filter Badges */}
            {(selectedCategory || selectedBrands.length > 0 || minRating > 0 || minDiscount > 0 || inStockOnly || searchQuery) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Active Filters:</span>
                
                {searchQuery && (
                  <span className="badge" style={{ background: '#e2e8f0', color: '#1e293b' }}>
                    "{searchQuery}" <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSearchQuery('')} />
                  </span>
                )}
                {selectedCategory && (
                  <span className="badge" style={{ background: '#d1fae5', color: '#065f46' }}>
                    Category: {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                    <X size={12} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => setSelectedCategory('')} />
                  </span>
                )}
                {selectedBrands.map((b) => (
                  <span key={b} className="badge" style={{ background: '#e0f2fe', color: '#0369a1' }}>
                    Brand: {b}
                    <X size={12} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => handleBrandToggle(b)} />
                  </span>
                ))}
                {minRating > 0 && (
                  <span className="badge" style={{ background: '#fef3c7', color: '#92400e' }}>
                    {minRating}★ & above
                    <X size={12} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => setMinRating(0)} />
                  </span>
                )}
                {minDiscount > 0 && (
                  <span className="badge" style={{ background: '#fee2e2', color: '#991b1b' }}>
                    {minDiscount}%+ OFF
                    <X size={12} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => setMinDiscount(0)} />
                  </span>
                )}
                {inStockOnly && (
                  <span className="badge" style={{ background: '#ede9fe', color: '#5b21b6' }}>
                    In Stock
                    <X size={12} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => setInStockOnly(false)} />
                  </span>
                )}
                <button
                  onClick={handleResetFilters}
                  style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700, textDecoration: 'underline', background: 'none' }}
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Product Grid */}
            <ProductGrid products={filteredProducts} onResetFilters={handleResetFilters} />
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {isMobileFiltersOpen && (
        <div className="modal-backdrop" onClick={() => setIsMobileFiltersOpen(false)}>
          <div
            className="modal-card"
            style={{ maxWidth: '420px', padding: '24px', maxHeight: '85vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Filter Catalog</h3>
              <button onClick={() => setIsMobileFiltersOpen(false)} className="btn-icon">
                <X size={20} />
              </button>
            </div>
            {filterSidebarContent}
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Apply Filters ({filteredProducts.length} items)
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .catalog-layout {
            grid-template-columns: 1fr !important;
          }
          .show-on-mobile {
            display: inline-flex !important;
          }
        }
      `}</style>
    </div>
  );
};
