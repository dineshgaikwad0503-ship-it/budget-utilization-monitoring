const express = require('express');
const router = express.Router();
const { getThresholdSettings, updateThresholdSettings } = require('../controllers/settingController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.use(protect);
router.get('/thresholds', getThresholdSettings);
router.put('/thresholds', authorize('Admin', 'FinanceOfficer'), updateThresholdSettings);

module.exports = router;
