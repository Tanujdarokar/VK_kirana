import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px',
        color: '#64748b'
      }}>
        <ShoppingBag size={40} />
      </div>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
        Page Not Found
      </h2>
      <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '420px', margin: '0 auto 24px' }}>
        The grocery aisle or page you requested could not be located. It might have moved or been updated.
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary">
          <Home size={16} /> Return to Home
        </Link>
        <Link to="/products" className="btn btn-secondary">
          Browse Catalog
        </Link>
      </div>
    </div>
  );
};
