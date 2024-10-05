const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

// Thêm bài viết
router.post('/new', articleController.createArticle);

// Xem danh sách bài viết
router.get('/edit/:id', articleController.getDetailArticles);
router.get('/delete/:id', articleController.getDetailDeleteArticles);
router.post('/edit/:id', articleController.editArticles);
router.post('/delete/:id', articleController.deleteArticles);
router.get('/', articleController.getArticles);
// Route hiển thị form thêm bài viết
router.get('/add', articleController.addArticleForm);

// Route xử lý khi submit form thêm bài viết
router.post('/add', articleController.addArticle);

// Route xem danh sách bài viết và tìm kiếm cho người dùng
router.get('/user/articles', articleController.getUserArticles);

// Route xem chi tiết bài viết
router.get('/user/articles/:id', articleController.getUserArticleDetail);

module.exports = router;
