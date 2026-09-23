import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Bot,
  X,
  Plus,
  Minus,
  ShoppingBag,
  Send,
  Zap,
  CheckCircle2,
  ArrowRight,
  Clipboard
} from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import {
  KIRANA_SMART_KITS,
  getSuggestedWeeklyKiranaPlan,
  parseMultiLineGroceryList,
  findProductByKeywords
} from '../../data/aiAssistant';

export const KiranaAIAssistantModal = ({ isOpen, onClose, initialQuery = '' }) => {
  const { products } = useInventory();
  const { addToCart } = useCart();
  const { showSuccess, showInfo } = useToast();

  const [activeTab, setActiveTab] = useState('smart-kits'); // 'smart-kits' | 'chat' | 'paste-list'
  const [query, setQuery] = useState(initialQuery || 'I need groceries for 4 people for one week');
  const [chatInput, setChatInput] = useState('');
  const [pasteText, setPasteText] = useState('');
  const [selectedKit, setSelectedKit] = useState(KIRANA_SMART_KITS[0]);
  const [suggestedItems, setSuggestedItems] = useState([]);
  const [selectedItemIds, setSelectedItemIds] = useState(new Set());
  const [itemQuantities, setItemQuantities] = useState({});
  const [isAiThinking, setIsAiThinking] = useState(false);

  const handleLoadKit = useCallback((kit) => {
    setSelectedKit(kit);
    const resolved = kit.items.map((it) => {
      const prod = findProductByKeywords(products, it.keywords);
      return {
        ...it,
        product: prod
      };
    }).filter((it) => it.product);

    setSuggestedItems(resolved);

    // Default select all and map quantities
    const initialSelected = new Set();
    const initialQtys = {};

    resolved.forEach((item) => {
      if (item.product) {
        initialSelected.add(item.product.id);
        initialQtys[item.product.id] = item.quantity || 1;
      }
    });

    setSelectedItemIds(initialSelected);
    setItemQuantities(initialQtys);
  }, [products]);

  // Load kit on mount or query change
  useEffect(() => {
    if (isOpen) {
      if (initialQuery && initialQuery.trim()) {
        setQuery(initialQuery);
        setActiveTab('chat');
        setIsAiThinking(true);
        const timer = setTimeout(() => {
          const result = getSuggestedWeeklyKiranaPlan(initialQuery, products);
          setSelectedKit(result.kitInfo);
          setSuggestedItems(result.items);

          const initialSelected = new Set();
          const initialQtys = {};
          result.items.forEach((item) => {
            if (item.product) {
              initialSelected.add(item.product.id);
              initialQtys[item.product.id] = item.quantity || 1;
            }
          });
          setSelectedItemIds(initialSelected);
          setItemQuantities(initialQtys);
          setIsAiThinking(false);
        }, 300);
        return () => clearTimeout(timer);
      } else {
        handleLoadKit(KIRANA_SMART_KITS[0]);
      }
    }
  }, [isOpen, initialQuery, products, handleLoadKit]);

  const handleRunAiQuery = (customPrompt) => {
    const promptToRun = customPrompt || chatInput || query;
    if (!promptToRun.trim()) return;

    setIsAiThinking(true);
    setChatInput('');

    setTimeout(() => {
      const result = getSuggestedWeeklyKiranaPlan(promptToRun, products);
      setSelectedKit(result.kitInfo);
      setSuggestedItems(result.items);

      const initialSelected = new Set();
      const initialQtys = {};

      result.items.forEach((item) => {
        if (item.product) {
          initialSelected.add(item.product.id);
          initialQtys[item.product.id] = item.quantity || 1;
        }
      });

      setSelectedItemIds(initialSelected);
      setItemQuantities(initialQtys);
      setIsAiThinking(false);
      showInfo(`AI generated Kirana plan for: "${promptToRun}"`);
    }, 400);
  };

  const handleParsePasteList = () => {
    if (!pasteText.trim()) return;
    setIsAiThinking(true);

    setTimeout(() => {
      const parsed = parseMultiLineGroceryList(pasteText, products);
      if (parsed.length === 0) {
        setIsAiThinking(false);
        showInfo('No matching products found. Try using common items like "1 kg atta", "2L oil", "1kg dal".');
        return;
      }

      const formatted = parsed.map((p, idx) => ({
        key: `custom-${idx}`,
        name: p.product.name,
        quantity: p.quantity,
        unit: p.unit,
        product: p.product
      }));

      setSuggestedItems(formatted);
      setSelectedKit({
        id: 'custom-pasted-list',
        title: 'Custom Kirana Shopping List',
        subtitle: `Parsed ${formatted.length} grocery items from your text`,
        badge: 'Smart Parsed'
      });

      const initialSelected = new Set();
      const initialQtys = {};
      formatted.forEach((item) => {
        initialSelected.add(item.product.id);
        initialQtys[item.product.id] = item.quantity || 1;
      });

      setSelectedItemIds(initialSelected);
      setItemQuantities(initialQtys);
      setIsAiThinking(false);
      showSuccess(`Successfully mapped ${formatted.length} Indian grocery items!`);
    }, 300);
  };

  const toggleItemSelection = (productId) => {
    setSelectedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const handleQuantityChange = (productId, delta) => {
    setItemQuantities((prev) => {
      const current = prev[productId] || 1;
      const nextVal = Math.max(1, Math.min(20, current + delta));
      return { ...prev, [productId]: nextVal };
    });
  };

  const handleAddAllToCart = () => {
    let count = 0;
    suggestedItems.forEach((item) => {
      if (item.product && selectedItemIds.has(item.product.id)) {
        const qty = itemQuantities[item.product.id] || 1;
        addToCart(item.product, qty);
        count += qty;
      }
    });

    if (count > 0) {
      showSuccess(`Added ${count} items to your shopping cart! 🛒`);
      onClose();
    } else {
      showInfo('Please select at least one item to add.');
    }
  };

  // Calculate total price of selected items
  const totalPrice = suggestedItems.reduce((sum, item) => {
    if (item.product && selectedItemIds.has(item.product.id)) {
      const qty = itemQuantities[item.product.id] || 1;
      const price = item.product.discountPrice || item.product.price;
      return sum + price * qty;
    }
    return sum;
  }, 0);

  const totalOriginalPrice = suggestedItems.reduce((sum, item) => {
    if (item.product && selectedItemIds.has(item.product.id)) {
      const qty = itemQuantities[item.product.id] || 1;
      return sum + item.product.price * qty;
    }
    return sum;
  }, 0);

  const totalSavings = totalOriginalPrice - totalPrice;

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '820px',
          width: '95%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          borderRadius: '20px',
          boxShadow: '0 25px 60px -15px rgba(6, 78, 59, 0.3)'
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%)',
            color: 'white',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <Bot size={26} color="#facc15" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                  Kirana AI Shopping Assistant
                </h3>
                <span
                  style={{
                    background: '#facc15',
                    color: '#064e3b',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '20px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  AI Powered
                </span>
              </div>
              <p style={{ margin: '3px 0 0', fontSize: '0.84rem', opacity: 0.9 }}>
                Understands Hindi, Hinglish & generates 1-click Kirana ration lists
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              color: 'white',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            padding: '4px 20px 0',
            gap: '8px'
          }}
        >
          <button
            onClick={() => setActiveTab('smart-kits')}
            style={{
              padding: '12px 18px',
              fontSize: '0.88rem',
              fontWeight: 700,
              color: activeTab === 'smart-kits' ? '#047857' : '#64748b',
              borderBottom: activeTab === 'smart-kits' ? '3px solid #047857' : '3px solid transparent',
              background: 'transparent',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={16} color={activeTab === 'smart-kits' ? '#047857' : '#64748b'} />
            <span>Curated Kirana Kits</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            style={{
              padding: '12px 18px',
              fontSize: '0.88rem',
              fontWeight: 700,
              color: activeTab === 'chat' ? '#047857' : '#64748b',
              borderBottom: activeTab === 'chat' ? '3px solid #047857' : '3px solid transparent',
              background: 'transparent',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Bot size={16} color={activeTab === 'chat' ? '#047857' : '#64748b'} />
            <span>Ask / Custom Prompt</span>
          </button>

          <button
            onClick={() => setActiveTab('paste-list')}
            style={{
              padding: '12px 18px',
              fontSize: '0.88rem',
              fontWeight: 700,
              color: activeTab === 'paste-list' ? '#047857' : '#64748b',
              borderBottom: activeTab === 'paste-list' ? '3px solid #047857' : '3px solid transparent',
              background: 'transparent',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Clipboard size={16} color={activeTab === 'paste-list' ? '#047857' : '#64748b'} />
            <span>Paste WhatsApp Grocery List</span>
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', backgroundColor: '#ffffff' }}>
          {/* Smart Kits Selection Carousel / Chips */}
          {activeTab === 'smart-kits' && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Select a Standard Indian Ration Bundle:
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '10px'
                }}
              >
                {KIRANA_SMART_KITS.map((kit) => {
                  const isSelected = selectedKit?.id === kit.id;
                  return (
                    <div
                      key={kit.id}
                      onClick={() => handleLoadKit(kit)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #059669' : '1px solid #e2e8f0',
                        backgroundColor: isSelected ? '#ecfdf5' : '#f8fafc',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: isSelected ? '#047857' : '#e2e8f0',
                            color: isSelected ? 'white' : '#475569'
                          }}
                        >
                          {kit.badge}
                        </span>
                        {isSelected && <CheckCircle2 size={16} color="#059669" />}
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>{kit.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '3px', lineHeight: 1.3 }}>
                        {kit.subtitle}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ask / Chat Tab Input */}
          {activeTab === 'chat' && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '8px', fontWeight: 600 }}>
                Enter what you need in Hindi, English or Hinglish (e.g. <i>"I need groceries for 4 people for one week"</i>, <i>"2 kilo chini, 1 packet tata salt, 1 litre amul milk"</i>):
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRunAiQuery()}
                  placeholder="e.g. 1 kg atta, 500g sugar, 2 packets Parle G, 1L milk..."
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.92rem'
                  }}
                />
                <button
                  onClick={() => handleRunAiQuery()}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Send size={16} />
                  <span>Ask AI</span>
                </button>
              </div>

              {/* Quick Prompt Suggestions */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                {[
                  'Groceries for 4 people for one week',
                  'Chai & Shaam Ka Nashta Bundle',
                  'Monthly Bachelor Ration Kit',
                  'Pooja, Sweets & Dry Fruit Platter'
                ].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handleRunAiQuery(preset)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '20px',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      backgroundColor: '#f1f5f9',
                      border: '1px solid #e2e8f0',
                      color: '#334155',
                      cursor: 'pointer'
                    }}
                  >
                    ✨ {preset}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Paste WhatsApp List Tab */}
          {activeTab === 'paste-list' && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '8px', fontWeight: 600 }}>
                Paste your handwritten / WhatsApp grocery list below:
              </div>
              <textarea
                rows={4}
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder={`1. 5kg Aashirvaad Atta\n2. 5kg Rice\n3. 1kg Toor Dal\n4. 2L Fortune Oil\n5. 1kg Sugar\n6. 1 packet Tata Salt\n7. 500g Tata Tea\n8. 2 packets Parle-G\n9. 7L Amul Milk`}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.88rem',
                  fontFamily: 'monospace',
                  marginBottom: '10px'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Supports formats like "5kg Atta", "1 packet salt", "2L oil", "aadha kilo dal"
                </span>
                <button onClick={handleParsePasteList} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={16} />
                  <span>Parse & Match Products</span>
                </button>
              </div>
            </div>
          )}

          {/* Active Kit / List Title Banner */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '12px',
              marginBottom: '16px'
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#065f46' }}>
                {selectedKit?.title || 'AI Recommended Kirana Grocery Basket'}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#047857' }}>
                {selectedKit?.description || `${suggestedItems.length} items mapped to real inventory with exact pack sizes`}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  padding: '4px 10px',
                  borderRadius: '20px'
                }}
              >
                {selectedItemIds.size} of {suggestedItems.length} items selected
              </span>
            </div>
          </div>

          {/* AI Suggested Products List */}
          {isAiThinking ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#047857' }}>
              <Sparkles size={32} className="animate-spin" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontWeight: 700 }}>AI is matching Indian Kirana brands & quantities...</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {suggestedItems.map((item) => {
                const isSelected = selectedItemIds.has(item.product.id);
                const qty = itemQuantities[item.product.id] || 1;
                const unitPrice = item.product.discountPrice || item.product.price;
                const itemTotal = unitPrice * qty;

                return (
                  <div
                    key={item.product.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: isSelected ? '1.5px solid #10b981' : '1px solid #e2e8f0',
                      backgroundColor: isSelected ? '#ffffff' : '#f8fafc',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {/* Left: Checkbox + Image + Details */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleItemSelection(item.product.id)}
                        style={{
                          width: '18px',
                          height: '18px',
                          accentColor: '#059669',
                          cursor: 'pointer'
                        }}
                      />

                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                          border: '1px solid #e2e8f0'
                        }}
                      />

                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                          {item.product.name}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              backgroundColor: '#f1f5f9',
                              color: '#475569',
                              padding: '1px 6px',
                              borderRadius: '4px'
                            }}
                          >
                            Unit: {item.product.unit}
                          </span>
                          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#047857' }}>
                            ₹{unitPrice}
                          </span>
                          {item.product.discount > 0 && (
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                              ₹{item.product.price}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Quantity Stepper + Item Total */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: '#f1f5f9',
                          padding: '3px 6px',
                          borderRadius: '8px'
                        }}
                      >
                        <button
                          onClick={() => handleQuantityChange(item.product.id, -1)}
                          disabled={!isSelected}
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '4px',
                            border: 'none',
                            background: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: isSelected ? 'pointer' : 'default',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                          }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ fontWeight: 800, fontSize: '0.85rem', minWidth: '20px', textAlign: 'center' }}>
                          {qty}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.product.id, 1)}
                          disabled={!isSelected}
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '4px',
                            border: 'none',
                            background: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: isSelected ? 'pointer' : 'default',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                          }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div style={{ minWidth: '70px', textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                          ₹{itemTotal}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with Summary & "Add All to Cart" Action */}
        <div
          style={{
            padding: '16px 24px',
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Total ({selectedItemIds.size} items):</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#047857' }}>
                ₹{totalPrice}
              </span>
              {totalSavings > 0 && (
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#15803d',
                    backgroundColor: '#dcfce7',
                    padding: '2px 8px',
                    borderRadius: '12px'
                  }}
                >
                  You Save ₹{totalSavings}
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
              ⚡ 15-Minute Delivery directly from local Kirana Dukan
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={onClose}
              className="btn btn-secondary"
              style={{ padding: '10px 18px', fontSize: '0.88rem' }}
            >
              Cancel
            </button>
            <button
              onClick={handleAddAllToCart}
              disabled={selectedItemIds.size === 0}
              className="btn btn-primary btn-lg"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                fontSize: '0.95rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)'
              }}
            >
              <ShoppingBag size={18} />
              <span>Add All to Cart (₹{totalPrice})</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
