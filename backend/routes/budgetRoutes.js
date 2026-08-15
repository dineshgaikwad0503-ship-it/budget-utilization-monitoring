const express = require('express');
const router = express.Router();
const { getBudgets, getBudget, createBudget, updateBudget, deleteBudget } = require('../controllers/budgetController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.use(protect);
router.get('/', getBudgets);
router.get('/:id', getBudget);
router.post('/', authorize('Admin', 'FinanceOfficer'), createBudget);
router.put('/:id', authorize('Admin', 'FinanceOfficer'), updateBudget);
router.delete('/:id', authorize('Admin'), deleteBudget);

module.exports = router;
