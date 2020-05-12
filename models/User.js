const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  displayName: String,
  username: { type: String, default: '' }
});

module.exports = User = mongoose.model('user', userSchema);
