const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

// Thêm bài viết
router.post('/new', articleController.createArticle);

// Xem danh sách bài viết
router.get('/', articleController.getArticles);

module.exports = router;
