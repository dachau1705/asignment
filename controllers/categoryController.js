const Category = require('../models/category');

// Thêm danh mục mới
exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const slug = generateSlug(name);

        const newCategory = new Category({ name, slug });
        await newCategory.save();
        res.redirect('/categories');
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo danh mục', error });
    }
};

// Lấy danh sách danh mục
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.render('categories/list', { categories });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi lấy danh sách danh mục', error });
    }
};

// Xoá danh mục
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await Category.findByIdAndDelete(id);
        res.redirect('/categories');
    } catch (error) {
        res.status(500).json({ message: 'Lỗi xoá danh mục', error });
    }
};

// Tạo slug từ tên danh mục
const generateSlug = (name) => {
    return name
        .toLowerCase()
        .replace(/ /g, '-')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w-]+/g, '');
};
