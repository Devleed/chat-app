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
  avatar: {
    type: String,
    default: 'https://vectorified.com/images/empty-profile-picture-icon-14.png'
  }
});

module.exports = User = mongoose.model('user', userSchema);
