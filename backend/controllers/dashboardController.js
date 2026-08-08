const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const ApiResponse = require('../utils/apiResponse');

const getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const monthStart = new Date(currentYear, currentMonth - 1, 1);
    const monthEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    const [totalIncome, totalExpense, monthIncome, monthExpense, categoryBreakdown, monthlyTrend, recentTransactions] = await Promise.all([
      Transaction.aggregate([
        { $match: { user: userId, type: 'income' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Transaction.aggregate([
        { $match: { user: userId, type: 'expense' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Transaction.aggregate([
        { $match: { user: userId, type: 'income', date: { $gte: monthStart, $lte: monthEnd } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Transaction.aggregate([
        { $match: { user: userId, type: 'expense', date: { $gte: monthStart, $lte: monthEnd } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Transaction.aggregate([
        { $match: { user: userId, type: 'expense', date: { $gte: monthStart, $lte: monthEnd } } },
        { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } },
      ]),
      Transaction.aggregate([
        { $match: { user: userId, date: { $gte: new Date(currentYear, 0, 1) } } },
        {
          $group: {
            _id: { month: { $month: '$date' }, type: '$type' },
            total: { $sum: '$amount' },
          },
        },
        { $sort: { '_id.month': 1 } },
      ]),
      Transaction.find({ user: userId }).sort('-date').limit(5),
    ]);

    const budgets = await Budget.find({
      user: userId,
      month: currentMonth,
      year: currentYear,
    });

    const budgetWithSpent = budgets.map((b) => {
      const spent = categoryBreakdown.find((c) => c._id === b.category)?.total || 0;
      return { ...b.toObject(), spent, remaining: b.amount - spent };
    });

    ApiResponse.success(res, {
      totalIncome: totalIncome[0]?.total || 0,
      totalExpense: totalExpense[0]?.total || 0,
      balance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
      monthIncome: monthIncome[0]?.total || 0,
      monthExpense: monthExpense[0]?.total || 0,
      monthBalance: (monthIncome[0]?.total || 0) - (monthExpense[0]?.total || 0),
      categoryBreakdown,
      monthlyTrend,
      recentTransactions,
      budgets: budgetWithSpent,
      monthlyBudget: req.user.monthlyBudget,
    });
  } catch (error) {
    next(error);
  }
};

const setBudget = async (req, res, next) => {
  try {
    const { category, amount, month, year } = req.body;

    if (!category || !amount || !month || !year) {
      return ApiResponse.error(res, 'Category, amount, month, and year are required', 400);
    }

    const budget = await Budget.findOneAndUpdate(
      { user: req.user._id, category, month, year },
      { amount: parseFloat(amount) },
      { upsert: true, new: true }
    );

    ApiResponse.success(res, budget, 'Budget saved');
  } catch (error) {
    next(error);
  }
};

const getBudgets = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const filter = { user: req.user._id };
    if (month) filter.month = parseInt(month);
    if (year) filter.year = parseInt(year);

    const budgets = await Budget.find(filter);
    ApiResponse.success(res, budgets);
  } catch (error) {
    next(error);
  }
};

const deleteBudget = async (req, res, next) => {
  try {
    await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    ApiResponse.success(res, null, 'Budget deleted');
  } catch (error) {
    next(error);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { period = 'year', year } = req.query;
    const targetYear = year ? parseInt(year) : new Date().getFullYear();

    const [categoryStats, paymentStats, incomeVsExpense, topExpenses] = await Promise.all([
      Transaction.aggregate([
        { $match: { user: userId, type: 'expense', date: { $gte: new Date(targetYear, 0, 1), $lte: new Date(targetYear, 11, 31) } } },
        { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 }, avg: { $avg: '$amount' } } },
        { $sort: { total: -1 } },
      ]),
      Transaction.aggregate([
        { $match: { user: userId, type: 'expense', date: { $gte: new Date(targetYear, 0, 1), $lte: new Date(targetYear, 11, 31) } } },
        { $group: { _id: '$paymentMethod', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } },
      ]),
      Transaction.aggregate([
        { $match: { user: userId, date: { $gte: new Date(targetYear, 0, 1), $lte: new Date(targetYear, 11, 31) } } },
        { $group: { _id: { month: { $month: '$date' }, type: '$type' }, total: { $sum: '$amount' } } },
        { $sort: { '_id.month': 1 } },
      ]),
      Transaction.find({ user: userId, type: 'expense', date: { $gte: new Date(targetYear, 0, 1), $lte: new Date(targetYear, 11, 31) } })
        .sort('-amount')
        .limit(5),
    ]);

    ApiResponse.success(res, { categoryStats, paymentStats, incomeVsExpense, topExpenses });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardData, setBudget, getBudgets, deleteBudget, getAnalytics };