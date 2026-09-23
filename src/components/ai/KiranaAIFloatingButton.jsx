import React, { useState } from 'react';
import { Bot, Sparkles, X } from 'lucide-react';
import { KiranaAIAssistantModal } from './KiranaAIAssistantModal';

export const KiranaAIFloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <>
      {/* Floating Action Button */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '8px'
        }}
      >
        {/* Helper Tooltip Badge */}
        {showTooltip && (
          <div
            style={{
              background: '#0f172a',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '12px',
              fontSize: '0.8rem',
              fontWeight: 600,
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              animation: 'bounce 2s infinite'
            }}
          >
            <Sparkles size={14} color="#facc15" />
            <span>Ask AI for 1-Week Kirana List!</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '0 2px'
              }}
            >
              <X size={12} />
            </button>
          </div>
        )}

        <button
          onClick={() => setIsOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 20px',
            borderRadius: '30px',
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            color: 'white',
            border: '2px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 12px 28px rgba(5, 150, 105, 0.45)',
            cursor: 'pointer',
            fontWeight: 800,
            fontSize: '0.92rem',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Bot size={18} color="#facc15" />
          </div>
          <span>Ask Kirana AI</span>
          <span
            style={{
              background: '#facc15',
              color: '#064e3b',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '2px 6px',
              borderRadius: '10px'
            }}
          >
            1-Click Cart
          </span>
        </button>
      </div>

      {/* Kirana AI Assistant Modal */}
      <KiranaAIAssistantModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
