const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 20,
        maxlength: 100
    },
    slug: {
        type: String,
        unique: true,
        required: true
    },
    originalLink: {
        type: String
    },
    category: {
        type: Schema.Types.ObjectId, // Reference to Category model
        ref: 'Category',
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: String
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['duyet', 'chua_duyet', 'da_xoa'],
        default: 'chua_duyet'
    }
});

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;
