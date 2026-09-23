import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { useCart } from './CartContext';

const WishlistContext = createContext();

const STORAGE_KEY_WISHLIST = 'vkcommerce_wishlist_items';

export const WishlistProvider = ({ children }) => {
  const { showSuccess, showInfo } = useToast();
  const { addToCart } = useCart();

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WISHLIST);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const addToWishlist = (product) => {
    if (!isInWishlist(product.id)) {
      setWishlist((prev) => [...prev, product]);
      showSuccess(`Added ${product.name} to wishlist!`);
    }
  };

  const removeFromWishlist = (productId) => {
    const item = wishlist.find((i) => i.id === productId);
    setWishlist((prev) => prev.filter((i) => i.id !== productId));
    if (item) {
      showInfo(`Removed ${item.name} from wishlist.`);
    }
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const moveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
  };

  const moveAllToCart = () => {
    wishlist.forEach((product) => {
      addToCart(product, 1);
    });
    setWishlist([]);
    showSuccess('Moved all items to your Cart!');
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        moveToCart,
        moveAllToCart,
        clearWishlist,
        wishlistCount: wishlist.length
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
