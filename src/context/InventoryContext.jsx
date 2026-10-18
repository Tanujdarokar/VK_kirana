import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { products as initialProducts } from '../data/products';
import { useToast } from './ToastContext';

const InventoryContext = createContext();

const STORAGE_KEY_INVENTORY = 'vkcommerce_kirana_products';
const STORAGE_KEY_REQUESTS = 'vkcommerce_requested_items';

// Augment initial products with realistic Kirana cost prices (Wholesale Purchase Cost)
const DEFAULT_KIRANA_ITEMS = initialProducts.map((p) => {
  const sellPrice = p.discountPrice || p.price;
  const costPrice = Math.round(sellPrice * (p.category === 'dairy' ? 0.90 : 0.82));
  return {
    ...p,
    costPrice: costPrice,
    minStockAlert: 5,
    unit: p.unit || '1 unit'
  };
});

const DEFAULT_REQUESTED_ITEMS = [
  {
    id: 'req-101',
    name: 'Fortune Kachi Ghani Mustard Oil 5L Jar',
    qty: '1 Jar',
    note: 'Urgent for family function',
    customerName: 'Harsh Verma',
    customerPhone: '+91 98765 12345',
    date: new Date(Date.now() - 86400000).toISOString(),
    status: 'Pending'
  },
  {
    id: 'req-102',
    name: 'Catch Sabzi Masala 100g',
    qty: '2 Pkts',
    note: 'Prefer latest MFD pack',
    customerName: 'Sneha Kapoor',
    customerPhone: '+91 98123 45678',
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    status: 'Pending'
  }
];

export const InventoryProvider = ({ children }) => {
  const { showSuccess, showInfo } = useToast();

  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INVENTORY);
      return saved ? JSON.parse(saved) : DEFAULT_KIRANA_ITEMS;
    } catch {
      return DEFAULT_KIRANA_ITEMS;
    }
  });

  const [requestedItems, setRequestedItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REQUESTS);
      return saved ? JSON.parse(saved) : DEFAULT_REQUESTED_ITEMS;
    } catch {
      return DEFAULT_REQUESTED_ITEMS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_INVENTORY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(requestedItems));
  }, [requestedItems]);

  // Add new Kirana item
  const addProduct = (newItem) => {
    const id = 'kirana-' + Date.now();
    const sellPrice = Number(newItem.discountPrice || newItem.price);
    const costPrice = Number(newItem.costPrice || Math.round(sellPrice * 0.8));
    const price = Number(newItem.price || sellPrice);
    const discount = price > sellPrice ? Math.round(((price - sellPrice) / price) * 100) : 0;

    const product = {
      id,
      name: newItem.name,
      hindiName: newItem.hindiName || '',
      category: newItem.category || 'rice-grains',
      categoryName: newItem.categoryName || 'General Grocery',
      brand: newItem.brand || 'Local Kirana',
      unit: newItem.unit || '1 unit',
      costPrice: costPrice,
      price: price,
      discountPrice: sellPrice,
      discount: discount,
      stock: Number(newItem.stock || 20),
      minStockAlert: Number(newItem.minStockAlert || 5),
      image: newItem.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
      description: newItem.description || `${newItem.name} available at your local Kirana store.`,
      features: newItem.features || ['Fresh Kirana Quality', 'Best Market Price', 'Hygienically Packed'],
      rating: 4.8,
      reviewsCount: 12,
      isPopular: !!newItem.isPopular,
      isDeal: !!newItem.isDeal,
      isFresh: !!newItem.isFresh
    };

    setProducts((prev) => [product, ...prev]);
    showSuccess(`Added "${product.name}" to Kirana Inventory!`);
    return product;
  };

  // Update existing item
  const updateProduct = (id, updatedData) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const sellPrice = Number(updatedData.discountPrice || updatedData.price || item.discountPrice || item.price);
          const price = Number(updatedData.price || item.price);
          const discount = price > sellPrice ? Math.round(((price - sellPrice) / price) * 100) : 0;

          return {
            ...item,
            ...updatedData,
            price,
            discountPrice: sellPrice,
            discount,
            costPrice: Number(updatedData.costPrice !== undefined ? updatedData.costPrice : item.costPrice),
            stock: Number(updatedData.stock !== undefined ? updatedData.stock : item.stock)
          };
        }
        return item;
      })
    );
    showSuccess('Kirana item updated successfully!');
  };

  // Adjust stock count (+ or -)
  const adjustStock = (id, delta) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStock = Math.max(0, item.stock + delta);
          return { ...item, stock: newStock };
        }
        return item;
      })
    );
  };

  // Deduct stock after sale
  const deductSoldStock = (soldItems) => {
    setProducts((prev) => {
      const updated = [...prev];
      soldItems.forEach(({ product, quantity }) => {
        const idx = updated.findIndex((p) => p.id === product.id);
        if (idx > -1) {
          updated[idx] = {
            ...updated[idx],
            stock: Math.max(0, updated[idx].stock - quantity)
          };
        }
      });
      return updated;
    });
  };

  // Delete product
  const deleteProduct = (id) => {
    const item = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (item) {
      showInfo(`Removed "${item.name}" from inventory.`);
    }
  };

  // Item Request / Notepad Functions
  const addRequestedItem = ({ name, qty, note, customerName, customerPhone }) => {
    const newReq = {
      id: 'req-' + Date.now(),
      name: name.trim(),
      qty: qty || '1 unit',
      note: note || '',
      customerName: customerName || 'Valued Customer',
      customerPhone: customerPhone || '',
      date: new Date().toISOString(),
      status: 'Pending'
    };

    setRequestedItems((prev) => [newReq, ...prev]);
    showSuccess(`Item note for "${name}" submitted to Storekeeper! 📝`);
    return newReq;
  };

  const deleteRequestedItem = (id) => {
    setRequestedItems((prev) => prev.filter((r) => r.id !== id));
    showInfo('Requested item note removed.');
  };

  const fulfillRequestedItem = (reqId, productData) => {
    const newProd = addProduct(productData);
    deleteRequestedItem(reqId);
    showSuccess(`Added "${newProd.name}" to inventory & cleared request!`);
  };

  // Get product by ID
  const getProductById = (id) => products.find((p) => p.id === id);

  // Computed metrics
  const inventoryMetrics = useMemo(() => {
    let totalItems = products.length;
    let lowStockItems = [];
    let outOfStockItems = [];
    let totalValuationCost = 0;
    let totalValuationSell = 0;

    products.forEach((p) => {
      const cp = p.costPrice || Math.round((p.discountPrice || p.price) * 0.8);
      const sp = p.discountPrice || p.price;
      totalValuationCost += cp * p.stock;
      totalValuationSell += sp * p.stock;

      if (p.stock === 0) {
        outOfStockItems.push(p);
      } else if (p.stock <= (p.minStockAlert || 5)) {
        lowStockItems.push(p);
      }
    });

    const potentialGrossProfit = totalValuationSell - totalValuationCost;

    return {
      totalItems,
      lowStockItems,
      outOfStockItems,
      lowStockCount: lowStockItems.length,
      outOfStockCount: outOfStockItems.length,
      totalValuationCost,
      totalValuationSell,
      potentialGrossProfit,
      requestedCount: requestedItems.length
    };
  }, [products, requestedItems.length]);

  return (
    <InventoryContext.Provider
      value={{
        products,
        requestedItems,
        addProduct,
        updateProduct,
        adjustStock,
        deductSoldStock,
        deleteProduct,
        addRequestedItem,
        deleteRequestedItem,
        fulfillRequestedItem,
        getProductById,
        ...inventoryMetrics
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
