const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const connectDB = require('../config/db');

const categories = {
  expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Rent', 'Other'],
  income: ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other'],
};

const seed = async () => {
  await connectDB();

  await User.deleteMany({});
  await Transaction.deleteMany({});
  await Budget.deleteMany({});

  const password = await bcrypt.hash('demo123', 12);
  const user = await User.create({
    name: 'Demo User',
    email: 'demo@expense.com',
    password,
    currency: 'USD',
    monthlyBudget: 3000,
  });

  const now = new Date();
  const transactions = [];

  for (let m = 5; m >= 0; m--) {
    const month = new Date(now.getFullYear(), now.getMonth() - m, 1);

    transactions.push({
      user: user._id, type: 'income', amount: 5000,
      category: 'Salary', description: 'Monthly salary',
      date: new Date(month.getFullYear(), month.getMonth(), 1),
      paymentMethod: 'bank',
    });

    if (Math.random() > 0.5) {
      transactions.push({
        user: user._id, type: 'income',
        amount: Math.round(Math.random() * 1000 + 200),
        category: 'Freelance', description: 'Freelance project',
        date: new Date(month.getFullYear(), month.getMonth(), 15),
        paymentMethod: 'upi',
      });
    }

    const expenseCount = Math.floor(Math.random() * 8) + 8;
    for (let e = 0; e < expenseCount; e++) {
      const cat = categories.expense[Math.floor(Math.random() * categories.expense.length)];
      const amounts = { Food: [10, 80], Transport: [5, 50], Shopping: [20, 300], Bills: [50, 200], Entertainment: [10, 100], Health: [20, 150], Education: [30, 200], Rent: [800, 1500], Other: [5, 100] };
      const [min, max] = amounts[cat] || [10, 100];

      transactions.push({
        user: user._id, type: 'expense',
        amount: Math.round(Math.random() * (max - min) + min),
        category: cat,
        description: `${cat} expense`,
        date: new Date(month.getFullYear(), month.getMonth(), Math.floor(Math.random() * 28) + 1),
        paymentMethod: ['cash', 'card', 'upi'][Math.floor(Math.random() * 3)],
      });
    }
  }

  await Transaction.insertMany(transactions);

  const currentMonth = now.getMonth() + 1;
  const budgets = [
    { user: user._id, category: 'Food', amount: 500, month: currentMonth, year: now.getFullYear() },
    { user: user._id, category: 'Transport', amount: 200, month: currentMonth, year: now.getFullYear() },
    { user: user._id, category: 'Shopping', amount: 400, month: currentMonth, year: now.getFullYear() },
    { user: user._id, category: 'Entertainment', amount: 150, month: currentMonth, year: now.getFullYear() },
    { user: user._id, category: 'Bills', amount: 300, month: currentMonth, year: now.getFullYear() },
  ];
  await Budget.insertMany(budgets);

  console.log('✅ Seed complete!');
  console.log('📧 Email: akash@expense.com');
  console.log('🔑 Password: akash@123');
  process.exit();
};

seed().catch((err) => { console.error('❌', err); process.exit(1); });