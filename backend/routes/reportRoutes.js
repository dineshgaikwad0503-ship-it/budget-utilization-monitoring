const express = require('express');
const router = express.Router();
const { generateBudgetPdf, generateExpenditurePdf } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/budget-pdf', generateBudgetPdf);
router.get('/expenditure-pdf', generateExpenditurePdf);

module.exports = router;
