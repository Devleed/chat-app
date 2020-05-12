const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

module.exports = passport => {
  // login strategy
  passport.use(
    'login',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      async (username, password, done) => {
        try {
          const user = await User.findOne({ email: username });
          if (!user) return done(null, false, { msg: 'no user found' });
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) return done(null, false, { msg: 'wrong password' });
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // register strategy
  passport.use(
    'register',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
      },
      async (req, username, password, done) => {
        try {
          const userExists = await User.findOne({ email: username });
          if (userExists)
            return done(null, false, { msg: 'user already exists' });
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          const newUser = new User({
            name: req.body.name,
            email: username,
            password: hashedPassword
          });
          const savedUser = await newUser.save();
          return done(null, savedUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // auth strategy
  passport.use(
    'jwt',
    new JWTstrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload.id).select('name email');
        if (!user) done(null, false);
        else done(null, user);
      } catch (error) {
        done(error);
      }
    })
  );
};
