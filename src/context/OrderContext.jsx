import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCart } from './CartContext';
import { useToast } from './ToastContext';

const OrderContext = createContext();

const STORAGE_KEY_ORDERS = 'vkcommerce_orders';

const SAMPLE_ORDERS = [
  {
    id: 'VK-882194',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Delivered',
    deliverySlot: 'Standard Morning (7:00 AM - 10:00 AM)',
    customer: {
      name: 'Tanuj Sharma',
      email: 'tanuj@example.com',
      phone: '+91 98765 43210',
      address: {
        street: 'Flat 402, Green Meadows Residency, Sector 45',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560034'
      }
    },
    items: [
      {
        product: {
          id: 'dairy-1',
          name: 'Amul Taaza Homogenised Toned Milk',
          price: 74,
          discountPrice: 68,
          unit: '1 L (Tetra Pack)',
          image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80'
        },
        quantity: 2
      },
      {
        product: {
          id: 'rice-1',
          name: 'India Gate Royal Aged Basmati Rice',
          price: 650,
          discountPrice: 535,
          unit: '5 kg Bag',
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80'
        },
        quantity: 1
      }
    ],
    paymentMethod: 'UPI / Online Payment',
    subtotal: 671,
    deliveryFee: 0,
    handlingFee: 5,
    discount: 0,
    total: 676
  }
];

export const OrderProvider = ({ children }) => {
  const { clearCart } = useCart();
  const { showSuccess } = useToast();

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
      return saved ? JSON.parse(saved) : SAMPLE_ORDERS;
    } catch {
      return SAMPLE_ORDERS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
  }, [orders]);

  const placeOrder = (orderPayload) => {
    const orderId = 'VK-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      status: 'Confirmed',
      ...orderPayload
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    showSuccess(`Order ${orderId} placed successfully!`);
    return newOrder;
  };

  const getOrderById = (orderId) => {
    return orders.find((o) => o.id === orderId);
  };

  const cancelOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'Cancelled' } : o))
    );
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder, getOrderById, cancelOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export const useOrder = useOrders;

