const express = require('express');
const passport = require('passport');
const router = express.Router();
const path = require('path');

router.use(express.json());

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../static/auth.html'));
});

/**
 * Auth route - /auth/google
 * requests google to sign in user
 */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

/**
 * Auth callback route - /auth/google/callback
 * google kick callback on this route and then we handle on our server
 */
router.get('/google/callback', passport.authenticate('google'), (req, res) => {
  res.redirect('/');
});

/**
 * Logout route - /auth/logout
 * logs out user
 */
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

/**
 * fetch route - /current_user
 * fetches logged in user
 */
router.get('/current_user', (req, res) => {
  res.send(req.user);
});

module.exports = router;
