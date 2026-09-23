import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

const STORAGE_KEY_CART = 'vkcommerce_cart_items';
const FREE_DELIVERY_THRESHOLD = 499;
const STANDARD_DELIVERY_FEE = 40;
const HANDLING_FEE = 5;

export const CartProvider = ({ children }) => {
  const { showSuccess, showError, showInfo } = useToast();

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cartItems));
  }, [cartItems]);

  // Add to cart
  const addToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + qty;
        if (newQty > product.stock) {
          showError(`Only ${product.stock} items available in stock!`);
          return prev;
        }
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty
        };
        showSuccess(`Updated ${product.name} quantity to ${newQty}`);
        return updated;
      } else {
        if (qty > product.stock) {
          showError(`Only ${product.stock} items available in stock!`);
          return prev;
        }
        showSuccess(`Added ${product.name} to cart!`);
        return [...prev, { product, quantity: qty }];
      }
    });
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    const item = cartItems.find((i) => i.product.id === productId);
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
    if (item) {
      showInfo(`Removed ${item.product.name} from cart.`);
    }
  };

  // Update item quantity
  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) => {
      return prev.map((item) => {
        if (item.product.id === productId) {
          if (newQty > item.product.stock) {
            showError(`Maximum available stock is ${item.product.stock}`);
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      });
    });
  };

  // Clear Cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Totals Calculation
  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + (item.product.discountPrice || item.product.price) * item.quantity,
      0
    );
  }, [cartItems]);

  const originalSubtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cartItems]);

  const productSavings = originalSubtotal - subtotal;

  const deliveryFee = useMemo(() => {
    if (cartItems.length === 0) return 0;
    return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
  }, [subtotal, cartItems.length]);

  const handlingFee = cartItems.length === 0 ? 0 : HANDLING_FEE;

  const grandTotal = useMemo(() => {
    if (cartItems.length === 0) return 0;
    return subtotal + deliveryFee + handlingFee;
  }, [subtotal, deliveryFee, handlingFee, cartItems.length]);

  const totalSavings = productSavings;

  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const amountNeededForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const freeDeliveryProgress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);

  // Get item quantity in cart
  const getItemQuantity = (productId) => {
    const item = cartItems.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  // Check if item is in cart
  const isInCart = (productId) => {
    return cartItems.some((i) => i.product.id === productId);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
        isInCart,
        subtotal,
        originalSubtotal,
        productSavings,
        deliveryFee,
        handlingFee,
        grandTotal,
        totalSavings,
        amountNeededForFreeDelivery,
        freeDeliveryProgress,
        freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
