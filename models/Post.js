const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  image: String,
  likes: { type: Number, default: 0 },    // 👍 좋아요 필드
  reports: { type: Number, default: 0 },  // 🚨 신고 필드
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);