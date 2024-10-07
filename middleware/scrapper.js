const Article = require("../models/article");
const cheerio = require('cheerio');
const axios = require('axios');
require('dotenv').config(); // Load .env file

const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/ /g, '-')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')  // Loại bỏ dấu tiếng Việt
        .replace(/[^\w-]+/g, '');  // Loại bỏ ký tự không hợp lệ
};

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGOOSE_URL)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

async function fetchVNExpress() {
    const response = await axios.get('https://vnexpress.net/');
    const $ = cheerio.load(response.data);
    console.log(response.data);

    let count = 0; // Initialize a counter to track how many articles have been saved

    // Lấy các bài viết từ VNExpress (chỉnh selector cho phù hợp)
    $('article.item-news').each(async (index, element) => {
        if (count >= 2) return;  // Stop after saving 2 articles

        const title = $(element).find('h3.title-news a').text().trim();
        const link = $(element).find('h3.title-news a').attr('href');
        const slug = generateSlug(title);
        const describe = $(element).find('p.description').text().trim();
        const avatar = $(element).find('img').attr('src');

        // Lưu vào database nếu bài viết chưa tồn tại
        const existingArticle = await Article.findOne({ slug });
        if (!existingArticle) {
            const newArticle = new Article({
                title,
                slug,
                link,
                describe,
                avatar,
                content: describe,  // Giả sử content là phần mô tả (có thể cập nhật sau)
                author: 'VNExpress',
                status: 1,
                detailed_information: '123'
            });
            await newArticle.save();
            console.log(`Saved article: ${title}`);
            count++;  // Increment the counter after saving an article
        }
    });
}

module.exports = {
    fetchVNExpress
}