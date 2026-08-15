const express = require('express');
const router = express.Router();
const { getAlerts, getAlert, resolveAlert, triggerScan } = require('../controllers/alertController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.use(protect);
router.get('/', getAlerts);
router.get('/:id', getAlert);
router.put('/:id/resolve', authorize('Admin', 'FinanceOfficer'), resolveAlert);
router.post('/scan', authorize('Admin', 'FinanceOfficer'), triggerScan);

module.exports = router;
