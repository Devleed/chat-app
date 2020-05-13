const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) return res.send('Invalid token');
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(verified.id).select('name email');
    req.user = user;
    next();
  } catch (error) {
    res.send(error);
  }
};
