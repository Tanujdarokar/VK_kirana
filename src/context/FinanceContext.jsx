import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useInventory } from './InventoryContext';
import { useToast } from './ToastContext';

const FinanceContext = createContext();

const STORAGE_KEY_TRANSACTIONS = 'vkcommerce_kirana_transactions';
const STORAGE_KEY_EXPENSES = 'vkcommerce_kirana_expenses';
const STORAGE_KEY_KHATA = 'vkcommerce_kirana_khata';

// Initial sample customer khata accounts
const INITIAL_KHATA_CUSTOMERS = [
  {
    id: 'khata-1',
    name: 'Ramesh Sharma (Gupta Ji)',
    phone: '9876543210',
    address: 'House #12, 3rd Cross',
    balance: 450, // Pending Udhaar
    entries: [
      { id: 'ent-1', date: new Date(Date.now() - 4 * 86400000).toISOString(), type: 'udhaar', amount: 650, note: 'Atta 5kg + Refined Oil 1L' },
      { id: 'ent-2', date: new Date(Date.now() - 2 * 86400000).toISOString(), type: 'jama', amount: 200, note: 'Cash payment' }
    ]
  },
  {
    id: 'khata-2',
    name: 'Sunita Verma',
    phone: '9812345678',
    address: 'Flat 204, Sai Enclave',
    balance: 320,
    entries: [
      { id: 'ent-3', date: new Date(Date.now() - 3 * 86400000).toISOString(), type: 'udhaar', amount: 320, note: 'Milk 2L + Bread + Maggi 6pk' }
    ]
  },
  {
    id: 'khata-3',
    name: 'Mohan Lal Electrician',
    phone: '9899887766',
    address: 'Shop #4, Main Road',
    balance: 0,
    entries: [
      { id: 'ent-4', date: new Date(Date.now() - 5 * 86400000).toISOString(), type: 'udhaar', amount: 500, note: 'Basmati Rice 5kg' },
      { id: 'ent-5', date: new Date(Date.now() - 1 * 86400000).toISOString(), type: 'jama', amount: 500, note: 'GPay UPI cleared' }
    ]
  }
];

// Initial sample shop expenses
const INITIAL_EXPENSES = [
  { id: 'exp-1', date: new Date(Date.now() - 1 * 86400000).toISOString(), category: 'transport', amount: 150, note: 'Tempo transport fare from Mandi', paidVia: 'cash' },
  { id: 'exp-2', date: new Date(Date.now() - 2 * 86400000).toISOString(), category: 'bags', amount: 200, note: '100 pcs Grocery carry bags pack', paidVia: 'cash' },
  { id: 'exp-3', date: new Date(Date.now() - 3 * 86400000).toISOString(), category: 'tea_snacks', amount: 80, note: 'Evening tea & biscuits for helper', paidVia: 'cash' }
];

// Initial sample sales transactions
const INITIAL_TRANSACTIONS = [
  {
    id: 'TXN-901',
    date: new Date(Date.now() - 30 * 60000).toISOString(),
    type: 'pos',
    customerName: 'Walk-in Customer',
    items: [
      { product: { id: 'dairy-1', name: 'Amul Taaza Milk', discountPrice: 68, costPrice: 61, unit: '1 L' }, quantity: 2 },
      { product: { id: 'bakery-1', name: 'Modern Whole Wheat Bread', discountPrice: 48, costPrice: 40, unit: '400 g' }, quantity: 1 }
    ],
    subtotal: 184,
    cost: 162,
    profit: 22,
    paymentMethod: 'cash',
    amountPaid: 200,
    changeReturned: 16
  },
  {
    id: 'TXN-902',
    date: new Date(Date.now() - 120 * 60000).toISOString(),
    type: 'pos',
    customerName: 'Suresh Kumar',
    items: [
      { product: { id: 'rice-1', name: 'India Gate Royal Basmati Rice', discountPrice: 535, costPrice: 440, unit: '5 kg' }, quantity: 1 },
      { product: { id: 'oil-1', name: 'Fortune Sunflower Oil', discountPrice: 149, costPrice: 125, unit: '1 L' }, quantity: 1 }
    ],
    subtotal: 684,
    cost: 565,
    profit: 119,
    paymentMethod: 'upi',
    amountPaid: 684,
    changeReturned: 0
  }
];

export const FinanceProvider = ({ children }) => {
  const { deductSoldStock } = useInventory();
  const { showSuccess, showError, showInfo } = useToast();

  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EXPENSES);
      return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
    } catch {
      return INITIAL_EXPENSES;
    }
  });

  const [khataCustomers, setKhataCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_KHATA);
      return saved ? JSON.parse(saved) : INITIAL_KHATA_CUSTOMERS;
    } catch {
      return INITIAL_KHATA_CUSTOMERS;
    }
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_KHATA, JSON.stringify(khataCustomers));
  }, [khataCustomers]);

  // Record a Counter POS Sale
  const recordPosSale = ({ items, customerName = 'Walk-in Customer', customerId = null, paymentMethod = 'cash', amountPaid = 0, discount = 0 }) => {
    let subtotal = 0;
    let totalCost = 0;

    items.forEach((item) => {
      const sp = item.product.discountPrice || item.product.price;
      const cp = item.product.costPrice || Math.round(sp * 0.8);
      subtotal += sp * item.quantity;
      totalCost += cp * item.quantity;
    });

    const finalTotal = Math.max(0, subtotal - discount);
    const profit = finalTotal - totalCost;
    const txnId = 'TXN-' + Math.floor(1000 + Math.random() * 9000);

    const newTxn = {
      id: txnId,
      date: new Date().toISOString(),
      type: 'pos',
      customerName,
      customerId,
      items,
      subtotal: finalTotal,
      cost: totalCost,
      profit,
      paymentMethod,
      amountPaid: paymentMethod === 'cash' ? Number(amountPaid || finalTotal) : finalTotal,
      changeReturned: paymentMethod === 'cash' ? Math.max(0, Number(amountPaid) - finalTotal) : 0
    };

    setTransactions((prev) => [newTxn, ...prev]);

    // Automatically deduct inventory
    deductSoldStock(items);

    // If payment method is Udhaar, record in Customer Khata
    if (paymentMethod === 'udhaar' && customerId) {
      addKhataEntry(customerId, {
        type: 'udhaar',
        amount: finalTotal,
        note: `POS Bill #${txnId} (${items.length} items)`
      });
    }

    showSuccess(`Billed ₹${finalTotal} (${paymentMethod.toUpperCase()}) successfully!`);
    return newTxn;
  };

  // Add Shop Expense
  const addExpense = ({ category, amount, note, paidVia = 'cash' }) => {
    const newExp = {
      id: 'exp-' + Date.now(),
      date: new Date().toISOString(),
      category,
      amount: Number(amount),
      note,
      paidVia
    };
    setExpenses((prev) => [newExp, ...prev]);
    showSuccess(`Recorded expense of ₹${amount} for ${category.replace('_', ' ')}`);
    return newExp;
  };

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    showInfo('Expense deleted.');
  };

  // Add Khata Customer
  const addKhataCustomer = ({ name, phone, address = '', initialBalance = 0 }) => {
    const id = 'khata-' + Date.now();
    const newCust = {
      id,
      name,
      phone,
      address,
      balance: Number(initialBalance),
      entries: initialBalance > 0 ? [{
        id: 'ent-' + Date.now(),
        date: new Date().toISOString(),
        type: 'udhaar',
        amount: Number(initialBalance),
        note: 'Opening balance'
      }] : []
    };

    setKhataCustomers((prev) => [newCust, ...prev]);
    showSuccess(`Created Khata account for ${name}`);
    return newCust;
  };

  // Add Khata Transaction (Udhaar or Jama)
  const addKhataEntry = (customerId, { type, amount, note }) => {
    const val = Number(amount);
    setKhataCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const newBalance = type === 'udhaar' ? c.balance + val : Math.max(0, c.balance - val);
          const newEntry = {
            id: 'ent-' + Date.now(),
            date: new Date().toISOString(),
            type,
            amount: val,
            note: note || (type === 'udhaar' ? 'Groceries taken' : 'Payment received')
          };
          return {
            ...c,
            balance: newBalance,
            entries: [newEntry, ...c.entries]
          };
        }
        return c;
      })
    );
    showSuccess(`Recorded ₹${val} ${type === 'udhaar' ? 'Udhaar' : 'Jama (Payment)'}`);
  };

  const deleteKhataCustomer = (customerId) => {
    setKhataCustomers((prev) => prev.filter((c) => c.id !== customerId));
    showInfo('Customer Khata removed.');
  };

  // Financial calculations
  const financialStats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];

    let todaySales = 0;
    let todayCost = 0;
    let todayProfit = 0;
    let todayCashCollection = 0;
    let todayUpiCollection = 0;
    let todayUdhaarGiven = 0;
    let totalSalesAllTime = 0;
    let totalProfitAllTime = 0;

    transactions.forEach((txn) => {
      const txnDate = txn.date.split('T')[0];
      totalSalesAllTime += txn.subtotal;
      totalProfitAllTime += txn.profit;

      if (txnDate === todayStr) {
        todaySales += txn.subtotal;
        todayCost += txn.cost;
        todayProfit += txn.profit;

        if (txn.paymentMethod === 'cash') todayCashCollection += txn.subtotal;
        if (txn.paymentMethod === 'upi') todayUpiCollection += txn.subtotal;
        if (txn.paymentMethod === 'udhaar') todayUdhaarGiven += txn.subtotal;
      }
    });

    let todayExpenses = 0;
    let totalExpensesAllTime = 0;
    expenses.forEach((exp) => {
      const expDate = exp.date.split('T')[0];
      totalExpensesAllTime += exp.amount;
      if (expDate === todayStr) {
        todayExpenses += exp.amount;
      }
    });

    const todayNetProfit = todayProfit - todayExpenses;
    const totalNetProfitAllTime = totalProfitAllTime - totalExpensesAllTime;

    const totalUdhaarPending = khataCustomers.reduce((sum, c) => sum + c.balance, 0);

    return {
      todaySales,
      todayCost,
      todayGrossProfit: todayProfit,
      todayExpenses,
      todayNetProfit,
      todayCashCollection,
      todayUpiCollection,
      todayUdhaarGiven,
      totalSalesAllTime,
      totalExpensesAllTime,
      totalNetProfitAllTime,
      totalUdhaarPending,
      totalTransactionsCount: transactions.length
    };
  }, [transactions, expenses, khataCustomers]);

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        expenses,
        khataCustomers,
        recordPosSale,
        addExpense,
        deleteExpense,
        addKhataCustomer,
        addKhataEntry,
        deleteKhataCustomer,
        ...financialStats
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
