// app.js
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3001;

// ✅ MongoDB 연결 (중복 없이 한 번만)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ DB Error:', err));
app.listen(port, () => {
  console.log(`서버 실행 중: ${port}`);
});

require('dotenv').config();

io.on('connection', (socket) => {
  console.log('사용자 접속됨');
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

server.listen(3000, () => {
  console.log('http://localhost:3001 에서 실행 중');
});

// DB 연결
mongoose.connect('mongodb://localhost:27017/community', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 미들웨어
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'secretKey',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/community' })
}));

app.set('view engine', 'ejs');

// 라우터 연결
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

app.use('/', authRoutes);
app.use('/posts', postRoutes);

// app.js
mongoose.connect(process.env.MONGO_URI);
