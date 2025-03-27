// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.get('/chat', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('chat', { user: req.session.user });
});

// 회원가입
router.get('/register', (req, res) => res.render('register'));
router.post('/register', async (req, res) => {
  await User.create(req.body);
  res.redirect('/login');
});

// 로그인
router.get('/login', (req, res) => res.render('login'));
router.post('/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user && await bcrypt.compare(req.body.password, user.password)) {
    req.session.user = user;
    res.redirect('/');
  } else {
    res.send('로그인 실패');
  }
});

// 로그아웃
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

router.get('/profile', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const user = await User.findOne({ username: req.session.user.username });
  res.render('profile', { user });
});

// 좋아요
router.post('/:id/like', async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } });
  res.redirect('/posts/' + req.params.id);
});

// 신고
router.post('/:id/report', async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, { $inc: { reports: 1 } });
  res.redirect('/posts/' + req.params.id);
});


module.exports = router;