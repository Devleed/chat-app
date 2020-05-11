const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const passport = require('passport');
const mongoose = require('mongoose');
const socketio = require('socket.io');

// environment variables setup
const dotenv = require('dotenv');
dotenv.config();

// configuring app
const app = express();

// port declaration
const port = process.env.PORT || 5000;

// server startup
const server = app.listen(port, () => console.log(`listening on port ${port}`));

// setting up socket io
const io = socketio(server);
require('./helpers/socketManager')(io);

// requiring services
require('./services/passport');

// middlewares
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY]
  })
);

// setting routes
app.use('/auth', require('./routes/auth'));
app.use('/message', require('./routes/message'));

// mongodb setup
mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('database connected'))
  .catch(e => console.log(`error => ${e}`));

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
