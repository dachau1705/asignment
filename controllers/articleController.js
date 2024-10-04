const Article = require("../models/article");

// Thêm bài viết mới
exports.createArticle = async (req, res) => {
    try {
        const { title, category, description, content, author, thumbnail, originalLink } = req.body;
        const slug = generateSlug(title);

        const newArticle = new Article({
            title,
            slug,
            category,
            description,
            content,
            author,
            thumbnail,
            originalLink
        });

        await newArticle.save();
        res.redirect('/articles');
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra', error });
    }
};

// Lấy danh sách bài viết
exports.getArticles = async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: -1 });
        res.render('articles/list', { articles });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi lấy danh sách bài viết', error });
    }
};

// Tạo slug từ tiêu đề
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/ /g, '-')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')  // Loại bỏ dấu tiếng Việt
        .replace(/[^\w-]+/g, '');  // Loại bỏ ký tự không hợp lệ
};
