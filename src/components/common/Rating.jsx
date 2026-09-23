import React from 'react';
import { Star } from 'lucide-react';

export const Rating = ({ rating = 0, reviewsCount, showCount = true, size = 15 }) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '2px',
        backgroundColor: '#ecfdf5',
        color: '#059669',
        padding: '2px 6px',
        borderRadius: '6px',
        fontWeight: 700,
        fontSize: '0.8rem'
      }}>
        <Star size={size} fill="#059669" strokeWidth={0} />
        <span>{Number(rating).toFixed(1)}</span>
      </div>
      {showCount && reviewsCount !== undefined && (
        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
          ({reviewsCount.toLocaleString()})
        </span>
      )}
    </div>
  );
};
