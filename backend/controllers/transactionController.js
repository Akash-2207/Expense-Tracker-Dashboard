const Transaction = require('../models/Transaction');
const ApiResponse = require('../utils/apiResponse');

const createTransaction = async (req, res, next) => {
  try {
    const { type, amount, category, description, date, paymentMethod, isRecurring, tags } = req.body;

    if (!type || !amount || !category) {
      return ApiResponse.error(res, 'Type, amount, and category are required', 400);
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      type,
      amount: parseFloat(amount),
      category,
      description: description || '',
      date: date || Date.now(),
      paymentMethod: paymentMethod || 'cash',
      isRecurring: isRecurring || false,
      tags: tags || [],
    });

    ApiResponse.success(res, transaction, 'Transaction added', 201);
  } catch (error) {
    next(error);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      category,
      startDate,
      endDate,
      search,
      sort = '-date',
      paymentMethod,
    } = req.query;

    const filter = { user: req.user._id };

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (paymentMethod) filter.paymentMethod = paymentMethod;

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate + 'T23:59:59');
    }

    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [transactions, total] = await Promise.all([
      Transaction.find(filter).sort(sort).skip(skip).limit(limitNum),
      Transaction.countDocuments(filter),
    ]);

    ApiResponse.success(res, {
      transactions,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) return ApiResponse.error(res, 'Transaction not found', 404);
    ApiResponse.success(res, transaction);
  } catch (error) {
    next(error);
  }
};

const updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) return ApiResponse.error(res, 'Transaction not found', 404);

    const fields = ['type', 'amount', 'category', 'description', 'date', 'paymentMethod', 'isRecurring', 'tags'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) transaction[field] = req.body[field];
    });

    const updated = await transaction.save();
    ApiResponse.success(res, updated, 'Transaction updated');
  } catch (error) {
    next(error);
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) return ApiResponse.error(res, 'Transaction not found', 404);

    await transaction.deleteOne();
    ApiResponse.success(res, null, 'Transaction deleted');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};