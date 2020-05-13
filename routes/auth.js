const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const util = require('util');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.use(express.json());

// promisifying jwt.sign method for clear code
jwt.sign = util.promisify(jwt.sign);

// helper to generate error
const generateError = (res, status, msg) => {
  return res.status(status).json({ msg });
};

// helper to generate token
const generateToken = async id => {
  try {
    const token = await jwt.sign({ id }, process.env.JWT_SECRET);
    return token;
  } catch (err) {
    generateError(res, 400, 'server error, try again later');
  }
};

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../static/auth.html'));
});

router.get('/current_user', verifyToken, async (req, res) => {
  res.json(req.user);
});

router.post('/register', async (req, res) => {
  // necessary stuff
  const { name, email, password } = req.body;

  if (!email) {
    return res.send.json({ msg: 'email is required ' });
  } else if (!name) {
    return res.send.json({ msg: 'name is required ' });
  } else if (!password) {
    return res.send.json({ msg: 'password is required ' });
  }

  try {
    // check if that email is taken
    const existingUser = await User.findOne({ email });
    // if yes send response back
    if (existingUser) return generateError(res, 403, 'User already exists');

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create and save user
    const user = await new User({
      name,
      email,
      password: hashedPassword
    }).save();

    // sign token
    const token = await generateToken(user.id);

    // send response
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    generateError(res, 500, `internal server error => ${err}`);
  }
});

router.post('/login', async (req, res) => {
  try {
    // necessary stuff
    const { email, password } = req.body;

    // try finding user
    const user = await User.findOne({ email });

    // if not found send err response
    if (!user) return generateError(res, 404, 'Incorrect Email');

    // try comparnig passwords
    const isMatch = await bcrypt.compare(password, user.password);

    // if not matched send err response
    if (!isMatch) return generateError(res, 401, 'Incorrect Password');

    // sign token
    const token = await generateToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    generateError(res, 500, `internal server error => ${err}`);
  }
});

module.exports = router;
