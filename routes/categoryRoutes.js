const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Lấy danh sách danh mục
router.get('/', categoryController.getCategories);

// Hiển thị form thêm danh mục
router.get('/add', categoryController.addCategoryForm);

// Xử lý thêm danh mục
router.post('/add', categoryController.addCategory);

// Hiển thị form sửa danh mục
router.get('/edit/:id', categoryController.editCategoryForm);

// Xử lý sửa danh mục
router.put('/:id', categoryController.editCategory);

// Xử lý xóa danh mục
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
