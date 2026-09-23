import React from 'react';
import { Link } from 'react-router-dom';

export const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/category/${category.slug}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '16px 12px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        textDecoration: 'none',
        position: 'relative',
        overflow: 'hidden'
      }}
      className="category-card-hover"
    >
      <div
        style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          backgroundColor: category.color || '#f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '10px',
          overflow: 'hidden',
          padding: '6px',
          transition: 'transform 0.3s ease'
        }}
      >
        <img
          src={category.image}
          alt={category.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '50%'
          }}
        />
      </div>

      <h4
        style={{
          fontSize: '0.88rem',
          fontWeight: 700,
          color: '#1e293b',
          marginBottom: '4px',
          lineHeight: 1.2
        }}
      >
        {category.name}
      </h4>

      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
        {category.itemCount}+ Items
      </span>
    </Link>
  );
};
