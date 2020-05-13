const express = require('express');
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
router.post('/update/username', async (req, res) => {});

module.exports = router;
