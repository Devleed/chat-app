const express = require('express');
const passport = require('passport');
const path = require('path');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.use(express.json());

const generateError = (res, status, msg) => {
  return res.status(status).json({ msg });
};

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../static/auth.html'));
});

router.get(
  '/current_user',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return generateError(res, 401, 'Unauthorized');
    res.json({ user });
  }
);

router.post(
  '/register',
  passport.authenticate('register', {
    session: false
  }),
  (req, res) => {
    jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, (err, token) => {
      if (err) return generateError(res, 400, 'server error, try again later');
      res.json({
        token: `Bearer ${token}`,
        user: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email
        }
      });
    });
  }
);

router.post(
  '/login',
  passport.authenticate('login', {
    session: false
  }),
  (req, res) => {
    jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, (err, token) => {
      if (err) return generateError(res, 500, 'server error, try again later');
      res.json({
        token: `Bearer ${token}`,
        user: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email
        }
      });
    });
  }
);

module.exports = router;
