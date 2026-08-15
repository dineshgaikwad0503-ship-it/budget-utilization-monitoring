const express = require('express');
const router = express.Router();
const { getExpenditures, getExpenditure, createExpenditure, updateExpenditure, deleteExpenditure } = require('../controllers/expenditureController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const upload = require('../middleware/upload');

router.use(protect);
router.get('/', getExpenditures);
router.get('/:id', getExpenditure);
router.post('/', authorize('Admin', 'FinanceOfficer', 'DepartmentHead'), upload.single('supportingDocument'), createExpenditure);
router.put('/:id', authorize('Admin', 'FinanceOfficer'), updateExpenditure);
router.delete('/:id', authorize('Admin'), deleteExpenditure);

module.exports = router;
