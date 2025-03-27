// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' } // admin 또는 user
});

userSchema.pre('save', async function(next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();

});

module.exports = mongoose.model('User', userSchema);