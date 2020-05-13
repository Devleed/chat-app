const express = require('express');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const verifyToken = require('../middlewares/verifyToken');

const User = require('../models/User');

const router = express.Router();

router.use(express.json());

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../static/user.html'));
});

/**
 * User route - /user/update/username
 * updates logged in user's username
 */
router.post('/update/avatar', verifyToken, async (req, res) => {
  console.log(req.files);
  res.send('success');
});

module.exports = router;
