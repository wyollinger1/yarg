var io = require('socket.io').listen(80);

io.sockets.on('connection', function(socket) {
    io.sockets.emit('new', { msg: 'new client connected'});

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
});