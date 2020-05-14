module.exports = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!email && !name && !password) {
    res.status(403).json({ msg: 'please enter required fields' });
  }
  next();
};
