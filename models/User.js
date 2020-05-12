const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  displayName: String,
  username: String
});

module.exports = User = mongoose.model('user', userSchema);
