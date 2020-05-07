const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const keys = require('./config/keys');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

// requiring services
require('./services/passport');

// middlewares
app.use(express.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

// setting routes
app.use('/auth', require('./routes/auth'));

// mongodb setup
mongoose
  .connect(keys.mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('database connected'))
  .catch(e => console.log(`error => ${e}`));

// port declaration
const port = process.env.PORT || 5000;

// checking th environment
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// test route
app.get('/', (req, res) => {
  res.send('psshhh..!!');
});

// server startup
app.listen(port, () => console.log(`listening on port ${port}`));
