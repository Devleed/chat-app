module.exports = (req, res, next) => {
  // if req.user does'nt exists user is not logged in
  if (!req.user)
    return res.status(401).json({ message: 'Please log in first' });

  // call next middleware
  next();
};
