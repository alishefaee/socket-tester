var netClient = require('./netClient');
var netServer = require('./netServer');

module.exports = function(server){
    global.io = require('socket.io')(server);
    // global.ioclients = {users: {}};

    io.sockets.on('connection', function (socket) {
        console.log('new SocketIO connection');
        // socket.emit('log', {type: 'success', msg: 'new SocketIO connection', when: new Date()});

        socket.on('msg', (data) => {
            // netClient.send(data)

            // socket.emit('news', 'ding!');
            // socket.emit('log', {type: 'info', msg: 'SocketIO:: msg:' + data, when: new Date()});

        });
        
        socket.on('send', (data) => {
            console.log('send: ', data);
            netClient.send(data.host, data.port, data.msg )
        });
        
        
        
        socket.on('listen', (data) => {
            // console.log('listen: ',data);
            netServer.listen(parseInt(data.port), data.listen )
        });
        
        
    });

}