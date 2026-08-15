const express = require('express');
const router = express.Router();
const {
  getSummary,
  getDepartmentWiseUtilization,
  getExpenditureTrend,
  getCategoryBreakdown,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/summary', getSummary);
router.get('/department-utilization', getDepartmentWiseUtilization);
router.get('/expenditure-trend', getExpenditureTrend);
router.get('/category-breakdown', getCategoryBreakdown);

module.exports = router;
