const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const ApiResponse = require('../utils/apiResponse');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return ApiResponse.error(res, 'Please provide name, email, and password', 400);
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return ApiResponse.error(res, 'Email already registered', 400);
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    ApiResponse.success(res, {
      _id: user._id,
      name: user.name,
      email: user.email,
      currency: user.currency,
      monthlyBudget: user.monthlyBudget,
      token,
    }, 'Registration successful', 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return ApiResponse.error(res, 'Please provide email and password', 400);
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return ApiResponse.error(res, 'Invalid email or password', 401);
    }

    const token = generateToken(user._id);

    ApiResponse.success(res, {
      _id: user._id,
      name: user.name,
      email: user.email,
      currency: user.currency,
      monthlyBudget: user.monthlyBudget,
      token,
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    ApiResponse.success(res, req.user);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return ApiResponse.error(res, 'User not found', 404);

    if (req.body.name) user.name = req.body.name;
    if (req.body.currency) user.currency = req.body.currency;
    if (req.body.monthlyBudget !== undefined) user.monthlyBudget = req.body.monthlyBudget;
    if (req.body.password) user.password = req.body.password;

    const updated = await user.save();
    const token = generateToken(updated._id);

    ApiResponse.success(res, {
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      currency: updated.currency,
      monthlyBudget: updated.monthlyBudget,
      token,
    }, 'Profile updated');
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getProfile, updateProfile };