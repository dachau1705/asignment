const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Article = require('./models/article');

// Cấu hình biến môi trường
dotenv.config();

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Dữ liệu mẫu cho các bài viết
const sampleArticles = [
  {
    title: "Bài viết mẫu 1 về tình hình kinh tế Việt Nam",
    slug: "bai-viet-mau-1-ve-tinh-hinh-kinh-te-viet-nam",
    category: "Kinh tế",
    description: "Bài viết này nói về tình hình kinh tế hiện tại của Việt Nam",
    content: "Đây là nội dung chi tiết của bài viết mẫu 1...",
    author: "Nguyễn Văn A",
    thumbnail: "https://example.com/image1.jpg",
    status: "duyet"
  },
  {
    title: "Bài viết mẫu 2 về chính trị thế giới",
    slug: "bai-viet-mau-2-ve-chinh-tri-the-gioi",
    category: "Chính trị",
    description: "Bài viết mẫu 2 này đề cập đến các vấn đề chính trị nổi bật trên thế giới",
    content: "Nội dung chi tiết của bài viết mẫu 2...",
    author: "Trần B",
    thumbnail: "https://example.com/image2.jpg",
    status: "duyet"
  },
  {
    title: "Bài viết mẫu 3 về công nghệ và tương lai",
    slug: "bai-viet-mau-3-ve-cong-nghe-va-tuong-lai",
    category: "Công nghệ",
    description: "Công nghệ sẽ thay đổi tương lai như thế nào? Bài viết mẫu 3 sẽ giải thích.",
    content: "Nội dung chi tiết của bài viết mẫu 3...",
    author: "Lê C",
    thumbnail: "https://example.com/image3.jpg",
    status: "chua_duyet"
  }
];

// Thêm các bài viết mẫu vào cơ sở dữ liệu
const seedDB = async () => {
  try {
    // Xóa tất cả bài viết hiện có
    await Article.deleteMany({});
    console.log('Deleted all articles');

    // Thêm bài viết mẫu mới
    await Article.insertMany(sampleArticles);
    console.log('Inserted sample articles');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();
