const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const articleRoutes = require('./routes/articleRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const path = require('path');

dotenv.config();
const app = express();

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Thiết lập view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Đường dẫn tĩnh
app.use(express.static(path.join(__dirname, 'public')));

// Route cho bài viết và danh mục
app.use('/articles', articleRoutes);
app.use('/categories', categoryRoutes);

// Cổng
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
