// routes/posts.js
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });

router.post('/new', upload.single('image'), async (req, res) => {
  await Post.create({
    title: req.body.title,
    content: req.body.content,
    author: req.session.user.username,
    image: req.file ? `/uploads/${req.file.filename}` : null,
    image: String
  });
  res.redirect('/posts');
});

// 글 상세 + 댓글 보기
router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  const comments = await Comment.find({ postId: req.params.id });
  res.render('post_detail', { post, comments, user: req.session.user });
});

// 댓글 작성
router.post('/:id/comments', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  await Comment.create({
    content: req.body.content,
    author: req.session.user.username,
    postId: req.params.id,
  });
  res.redirect(`/posts/${req.params.id}`);
});

// 메인 페이지 (목록)
router.get('/', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.render('index', { posts, user: req.session.user });
});

// 글 작성 폼
router.get('/new', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('post_form');
});

// 글 작성 처리
router.post('/new', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  await Post.create({ ...req.body, author: req.session.user.username });
  res.redirect('/posts');
});

// 글 상세
router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render('post_detail', { post });
});

// routes/posts.js
router.post('/:id/delete', async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (req.session.user && (req.session.user.username === post.author || req.session.user.role === 'admin')) {
    await Post.findByIdAndDelete(req.params.id);
  }
  res.redirect('/posts');
});

// 글 검색
router.get('/search', async (req, res) => {
  const query = req.query.q;
  const posts = await Post.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { content: { $regex: query, $options: 'i' } }
    ]
  });
  res.render('index', { posts, user: req.session.user });
});

module.exports = router;