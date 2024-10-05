const Category = require('../models/Category');

// Hiển thị danh sách danh mục
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.render('categories/list', { categories });
    } catch (error) {
        res.status(500).send("Lỗi khi lấy danh sách danh mục");
    }
};

// Hiển thị form thêm mới danh mục
exports.addCategoryForm = (req, res) => {
    res.render('categories/addCategory');
};

// Xử lý thêm danh mục
exports.addCategory = async (req, res) => {
    try {
        const { name } = req.body;

        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        const newCategory = new Category({
            name,
            slug,
        });

        await newCategory.save();
        res.redirect('/categories');
    } catch (error) {
        res.status(500).send("Có lỗi xảy ra khi thêm danh mục.");
    }
};

// Hiển thị form sửa danh mục
exports.editCategoryForm = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        res.render('categories/editCategory', { category });
    } catch (error) {
        res.status(500).send("Lỗi khi lấy thông tin danh mục");
    }
};

// Xử lý sửa danh mục
exports.editCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        await Category.findByIdAndUpdate(req.params.id, { name, slug });
        res.redirect('/categories');
    } catch (error) {
        res.status(500).send("Có lỗi xảy ra khi cập nhật danh mục.");
    }
};

// Xử lý xóa danh mục
exports.deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.redirect('/categories');
    } catch (error) {
        res.status(500).send("Có lỗi xảy ra khi xóa danh mục.");
    }
};
