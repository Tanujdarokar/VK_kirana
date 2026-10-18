import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const AuthContext = createContext();

const STORAGE_KEY_USER = 'vkcommerce_user';
const STORAGE_KEY_USERS = 'vkcommerce_registered_users';

// Vendor / Dukan Owner Primary Account
const DEMO_VENDOR = {
  id: 'vendor_001',
  name: 'Vijay Dukan Owner',
  email: 'vendor@vkcommerce.in',
  phone: '+91 98111 22233',
  role: 'vendor', // 'vendor' | 'user'
  shopName: 'VK Kirana & Supermarket',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  address: {
    street: 'Shop No 1, Main Mandi Market, Koramangala',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560034'
  }
};

// Customer / Buyer Primary Account
const DEMO_USER = {
  id: 'usr_demo123',
  name: 'Tanuj Sharma',
  email: 'tanuj@example.com',
  phone: '+91 98765 43210',
  role: 'user', // 'vendor' | 'user'
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  address: {
    street: 'Flat 402, Green Meadows Residency, Sector 45',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560034'
  }
};

export const AuthProvider = ({ children }) => {
  const { showSuccess, showError, showInfo } = useToast();

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : DEMO_USER;
    } catch {
      return DEMO_USER;
    }
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USERS);
      return saved ? JSON.parse(saved) : [DEMO_VENDOR, DEMO_USER];
    } catch {
      return [DEMO_VENDOR, DEMO_USER];
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const login = (email, password) => {
    const cleanEmail = email.toLowerCase().trim();

    // Check existing registered users
    const found = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (found) {
      setUser(found);
      showSuccess(`Logged in as ${found.role === 'vendor' ? '🏪 Vendor' : '🛒 Customer'}: ${found.name}!`);
      return { success: true, role: found.role };
    }

    // Determine role: vendor@vkcommerce.in or vendor keywords -> 'vendor', else -> 'user'
    const isVendorLogin = cleanEmail === 'vendor@vkcommerce.in' || cleanEmail.includes('vendor') || cleanEmail.includes('admin') || cleanEmail.includes('shop');
    const role = isVendorLogin ? 'vendor' : 'user';

    const newUser = {
      id: 'usr_' + Date.now(),
      name: cleanEmail.split('@')[0],
      email: cleanEmail,
      phone: '+91 98765 00000',
      role,
      shopName: isVendorLogin ? 'VK Kirana Store' : undefined,
      address: {
        street: isVendorLogin ? 'Mandi Market Main Gate' : '12th Cross Road, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038'
      }
    };

    setUser(newUser);
    setRegisteredUsers((prev) => [...prev, newUser]);
    showSuccess(`Logged in as ${role === 'vendor' ? '🏪 Vendor' : '🛒 Customer'}: ${newUser.name}!`);
    return { success: true, role };
  };

  const loginAsVendorDemo = () => {
    setUser(DEMO_VENDOR);
    showSuccess('Switched to Vendor / Dukan Owner Account! Full Khata & POS Access enabled.');
    return { success: true, role: 'vendor' };
  };

  const register = ({ name, email, password, phone, role = 'user' }) => {
    const cleanEmail = email.toLowerCase().trim();
    const existing = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      showError('An account with this email already exists!');
      return { success: false, message: 'Email already registered' };
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      name,
      email: cleanEmail,
      phone: phone || '+91 98765 43210',
      role: 'user', // Public registration is always Customer
      address: {
        street: '7th Main Road, Koramangala',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560095'
      }
    };

    setUser(newUser);
    setRegisteredUsers((prev) => [...prev, newUser]);
    showSuccess(`Customer account created successfully! Welcome ${name}`);
    return { success: true, role: 'user' };
  };

  const logout = () => {
    setUser(null);
    showInfo('You have logged out successfully.');
  };

  const updateProfile = (updatedData) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedData };
      setRegisteredUsers((all) => all.map((u) => (u.id === updated.id ? updated : u)));
      return updated;
    });
    showSuccess('Profile updated successfully!');
  };

  const isVendor = user?.role === 'vendor';
  const isCustomer = user?.role === 'user' || !user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isVendor,
        isCustomer,
        login,
        loginAsVendorDemo,
        register,
        logout,
        updateProfile,
        demoVendor: DEMO_VENDOR,
        demoUser: DEMO_USER
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
