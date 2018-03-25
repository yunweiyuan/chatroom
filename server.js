var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var users = [];

app.use('/', express.static(__dirname + '/www'));

server.listen(3000, function(){
  console.log('listening on *:3000');
});

io.sockets.on('connection', function(socket) {
  //new user login
  socket.on('login', function(nickname) {
    if(users.indexOf(nickname) > -1) {
      socket.emit('nickExisted');
    } else {
      socket.nickname = nickname;
      users.push(nickname);
      socket.emit('loginSuccess', nickname);
      io.sockets.emit('system', nickname, users.length, 'login');
    };
  });

  //user leaves
  socket.on('disconnect', function() {
    if(socket.nickname != null) {
      users.splice(users.indexOf(socket.nickname), 1);
      socket.broadcast.emit('system', socket.nickname, users.legnth, 'logout');
    }
  });

  //new message get
  socket.on('postMsg', function(msg, color) {
    socket.broadcast.emit('newMsg', socket.nickname, msg, color);
  });

});
