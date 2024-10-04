const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Thêm danh mục mới
router.post('/new', categoryController.createCategory);

// Xem danh sách danh mục
router.get('/', categoryController.getCategories);

// Xoá danh mục
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
