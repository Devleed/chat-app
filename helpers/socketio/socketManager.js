const {
  CONNECTION,
  USER_CONNECTED,
  USER_DISCONNECTED,
  USERS_ONLINE
} = require('./socketTypes');

const onlineUsers = {};
module.exports = io => {
  // manage io emits and connections
  // a new connection is established
  io.on(CONNECTION, socket => {
    console.log('connected =>', socket.id);
    // testing
    socket.emit('test', 'a message from server');
    // listen for when a user's online
    socket.on(USER_CONNECTED, user => {
      // save that user in its socket
      socket.user = user;
      // save the socket bu user's id
      onlineUsers[user._id] = socket;
      // tell all online users that this user is online
      socket.broadcast.emit(USERS_ONLINE, Object.keys(onlineUsers));
      // socket.emit('online_users', Object.keys(onlineUsers));
    });

    // user's offline
    socket.on(USER_DISCONNECTED, user => {
      // delete user from online users
      delete onlineUsers[user._id];
      // tell all online users that this user is offline
      socket.broadcast.emit(USERS_ONLINE, Object.keys(onlineUsers));
    });
  });
};
