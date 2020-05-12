const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  register_date: {
    type: Date,
    required: true,
    default: Date.now()
  },
  passwordResetToken: {
    type: String,
    default: null
  },
  passwordResetTokenExpiry: {
    type: Date
  },
  avatar: {
    type: String
  }
});

module.exports = User = mongoose.model('user', userSchema);
