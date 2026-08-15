const express = require('express');
const router = express.Router();
const { getDepartments, getDepartment, createDepartment, updateDepartment, deleteDepartment } = require('../controllers/departmentController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.use(protect);
router.get('/', getDepartments);
router.get('/:id', getDepartment);
router.post('/', authorize('Admin'), createDepartment);
router.put('/:id', authorize('Admin'), updateDepartment);
router.delete('/:id', authorize('Admin'), deleteDepartment);

module.exports = router;
