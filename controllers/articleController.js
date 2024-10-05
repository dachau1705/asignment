const Article = require("../models/article");
const Category = require("../models/Category");

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
        const { searchTitle = '', searchAuthor = '', page = 1 } = req.query;
        const pageSize = 10;

        // Điều kiện tìm kiếm
        const query = {
            title: { $regex: searchTitle, $options: 'i' },
            author: { $regex: searchAuthor, $options: 'i' }
        };

        const articlesCount = await Article.countDocuments(query);
        const totalPages = Math.ceil(articlesCount / pageSize);

        const articles = await Article.find(query)
            .populate('category', 'name') // Lấy tên danh mục
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        res.render('articles/list', {
            articles: articles.map(article => ({
                ...article._doc,
                categoryName: article.category.name // Hiển thị tên danh mục
            })),
            searchTitle,
            searchAuthor,
            currentPage: parseInt(page, 10),
            totalPages,
            pageSize
        });
    } catch (error) {
        res.status(500).send('Lỗi khi lấy danh sách bài viết');
    }
};

exports.editArticles = async (req, res) => {
    try {
        const articleId = req.params.id;
        const updatedArticleData = {
            title: req.body.title,
            author: req.body.author,
            category: req.body.category,
            description: req.body.description,
            content: req.body.content,
            thumbnail: req.body.thumbnail,
            status: req.body.status,
        };

        await Article.findByIdAndUpdate(articleId, updatedArticleData);
        res.redirect('/articles'); // Sau khi sửa, chuyển về danh sách bài viết
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi server.');
    }
}

exports.getDetailArticles = async (req, res) => {
    try {
        const articleId = req.params.id;
        const article = await Article.findById(articleId); // Tìm bài viết theo ID
        if (!article) {
            return res.status(404).send('Bài viết không tồn tại.');
        }
        const categories = await Category.find(); // Lấy danh mục
        res.render('articles/edit', { article, categories });
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi server.');
    }
}

exports.getDetailDeleteArticles = async (req, res) => {
    try {
        const articleId = req.params.id;
        const article = await Article.findById(articleId); // Tìm bài viết theo ID
        if (!article) {
            return res.status(404).send('Bài viết không tồn tại.');
        }
        res.render('articles/delete', { article });
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi server.');
    }
}

exports.deleteArticles = async (req, res) => {
    try {
        const articleId = req.params.id;
        await Article.findByIdAndDelete(articleId); // Xóa bài viết
        res.redirect('/articles'); // Chuyển về danh sách bài viết
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi server.');
    }
}

exports.addArticleForm = async (req, res) => {
    try {
        // Lấy danh sách các danh mục
        const categories = await Category.find();

        res.render('articles/addArticle', {
            categories // Truyền danh mục vào view
        });
    } catch (error) {
        res.status(500).send('Lỗi khi lấy danh mục');
    }
};

// Xử lý thêm mới bài viết
exports.addArticle = async (req, res) => {
    try {
        const { title, author, category, description, content, image } = req.body;
        const slug = generateSlug(title);

        const newArticle = new Article({
            title,
            slug,
            author,
            category,
            description,
            content,
            image,
            status: 'chua_duyet',  // Mặc định là chưa duyệt
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await newArticle.save();
        res.redirect('/articles');
    } catch (error) {
        console.error("Lỗi khi thêm bài viết:", error);
        res.status(500).send("Có lỗi xảy ra khi thêm bài viết.");
    }
};

exports.getUserArticles = async (req, res) => {
    try {
        const { searchTitle, searchAuthor, searchDate } = req.query;

        // Điều kiện tìm kiếm
        let filter = { status: 'duyet' };

        if (searchTitle) {
            filter.title = { $regex: searchTitle, $options: 'i' }; // Tìm theo tiêu đề không phân biệt chữ hoa/chữ thường
        }

        if (searchAuthor) {
            filter.author = { $regex: searchAuthor, $options: 'i' }; // Tìm theo tác giả
        }

        if (searchDate) {
            const date = new Date(searchDate);
            const nextDay = new Date(date);
            nextDay.setDate(date.getDate() + 1); // Chọn bài viết của ngày hiện tại
            filter.createdAt = { $gte: date, $lt: nextDay };
        }

        // Lấy danh sách bài viết dựa trên filter
        const articles = await Article.find(filter);

        res.render('articles/userArticlesList', {
            articles,
            searchTitle,
            searchAuthor,
            searchDate
        });
    } catch (error) {
        res.status(500).send("Lỗi khi lấy danh sách bài viết");
    }
};

// Trang chi tiết bài viết cho người dùng
exports.getUserArticleDetail = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).send('Bài viết không tồn tại');
        }
        res.render('articles/userArticleDetail', { article });
    } catch (error) {
        res.status(500).send("Lỗi khi lấy thông tin bài viết");
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
