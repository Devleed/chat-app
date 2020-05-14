const express = require('express');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const fileUpload = require('express-fileupload');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.use(express.json());
router.use(fileUpload({ useTempFiles: true }));

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../static/user.html'));
});

/**
 * User route - /user/update/avatar
 * updates logged in user's avatar
 */
router.post('/update/avatar', verifyToken, async (req, res) => {
  try {
    // if there are no req.files
    if (!req.files) {
      // send err response
      return res.status(400).json({ msg: 'No image provided' });
    }
    // upload image on server
    const { url } = await cloudinary.uploader.upload(
      req.files.avatar.tempFilePath
    );
    // save the url
    req.user.avatar = url;
    await req.user.save();

    // send response
    res.json(req.user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'server error' });
  }
});

module.exports = router;
