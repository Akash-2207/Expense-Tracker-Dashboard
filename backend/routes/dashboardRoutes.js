const express = require('express');
const router = express.Router();
const { getDashboardData, setBudget, getBudgets, deleteBudget, getAnalytics } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getDashboardData);
router.get('/analytics', getAnalytics);
router.get('/budgets', getBudgets);
router.post('/budgets', setBudget);
router.delete('/budgets/:id', deleteBudget);

module.exports = router;