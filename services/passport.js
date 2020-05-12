const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// required models
const User = require('../models/User');

// serializing user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// deserializing user
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

// using google strategy
passport.use(
  new GoogleStrategy(
    {
      callbackURL: '/auth/google/callback',
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // try to find user with the google id provided
        const existingUser = await User.findOne({ googleId: profile.id });
        // if user exists return
        if (existingUser) {
          return done(null, existingUser);
        }
        // if not create and save one
        const user = await new User({
          googleId: profile.id,
          displayName: profile.displayName
        }).save();
        // return user
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
