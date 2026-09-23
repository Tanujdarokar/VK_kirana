import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const AuthContext = createContext();

const STORAGE_KEY_USER = 'vkcommerce_user';
const STORAGE_KEY_USERS = 'vkcommerce_registered_users';

// Demo initial user
const DEMO_USER = {
  id: 'usr_demo123',
  name: 'Tanuj Sharma',
  email: 'tanuj@example.com',
  phone: '+91 98765 43210',
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
      return saved ? JSON.parse(saved) : [DEMO_USER];
    } catch {
      return [DEMO_USER];
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
    // In mock setup, match email or allow demo
    const found = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setUser(found);
      showSuccess(`Welcome back, ${found.name}!`);
      return { success: true };
    }
    // Allow demo fallback login
    const newUser = {
      id: 'usr_' + Date.now(),
      name: email.split('@')[0],
      email: email,
      phone: '+91 98765 00000',
      address: {
        street: '12th Cross Road, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038'
      }
    };
    setUser(newUser);
    setRegisteredUsers((prev) => [...prev, newUser]);
    showSuccess(`Welcome, ${newUser.name}!`);
    return { success: true };
  };

  const register = ({ name, email, password, phone }) => {
    const existing = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      showError('An account with this email already exists!');
      return { success: false, message: 'Email already registered' };
    }
    const newUser = {
      id: 'usr_' + Date.now(),
      name,
      email,
      phone: phone || '+91 98765 43210',
      address: {
        street: '7th Main Road, Koramangala',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560095'
      }
    };
    setUser(newUser);
    setRegisteredUsers((prev) => [...prev, newUser]);
    showSuccess(`Account registered successfully! Welcome ${name}`);
    return { success: true };
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

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, updateProfile, demoUser: DEMO_USER }}>
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
