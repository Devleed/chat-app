const express = require('express');
const passport = require('passport');
const router = express.Router();
const path = require('path');

const User = require('../models/User');

router.use(express.json());

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../static/user.html'));
});

/**
 * User route - /user/update/username
 * updates logged in user's username
 */
router.post(
  '/update/username',
  passport.authenticate(
    'google',
    {
      scope: ['profile', 'email']
    },
    async (req, res) => {
      try {
        const user = await User.findByIdAndUpdate(
          req.user.id,
          {
            $set: { username: req.body.username }
          },
          { new: true }
        );

        res.json(user);
      } catch (err) {
        res.status(500).json({ message: `an error occured => ${err}` });
      }
    }
  )
);

module.exports = router;
