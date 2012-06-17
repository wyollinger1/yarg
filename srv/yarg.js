var io = require('socket.io').listen(80);

io.sockets.on('connection', function(socket) {
    io.sockets.emit('new', { msg: 'new client connected'});

    socket.on('message', function(from, msg) {
        console.log(
            'server received message from ', from, 
            ' with text ', msg);
    });
    
    socket.on('disconnect', function() {
        console.log('client disconnected');
    });
});