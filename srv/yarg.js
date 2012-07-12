/*
 *  Yarg
 *  Copyright (C) 2012  Max DeLiso, Jared Bean

 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.

 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.

 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
var io = require('socket.io').listen(80);
var stream = require('./stream.js');

io.sockets.on('connection', function(socket) {
    io.sockets.emit('new', { msg: 'new client connected'});
    var user=stream.createUser()
    socket.on('login', function(msg) {
      var login;
      try{
        login= JSON.parse(msg)
      }catch(err){
        socket.emit('login', {msg: "Unrecognized login format"});
        return
      }
      user.login(login.username, login.password, function(err, user){
        if(user.id==null){
          socket.emit('login', {msg: "Failure, no matching username and password"+user.id});
          return
        }
        socket.emit('login', {msg: "Logged in as " + login.username});
      });
  });
});
function setUp(socket){
  /* Set up rest of API */
  socket.on('message', function(msg) {
      console.log('server received message', msg);
  });
    
  socket.on('disconnect', function() {
    console.log('client disconnected');
  });

  socket.on('click', function(msg) {
    console.log('click: ', msg);
  });

  socket.on('keydown', function(msg) {
    console.log('keydown: ', msg);
  });

  socket.on('keyup', function(msg) {
    console.log('keyup: ', msg);
  });
}

