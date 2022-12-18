
var net = require('net');

module.exports = {
    listen(_port, listen){

        if(global.netServer){
            // if(!listen)
            //     return netServer.close()
            netServer.close()
            global.netServer = undefined;
            return console.log('global netServer exists');
        }
        
        // creates the server
        var server = net.createServer();


        //emitted when server closes ...not emitted until all connections closes.
        server.on('close', function (error) {
            io.emit('log_s', {type: 'error', msg: 'Closed. error: ' + error, when: new Date()})
            global.netServer = undefined;
            io.emit('listen', {status: false, when: new Date()})
            console.log('Server closed !');
        });
        
        // emitted when new client connects
        server.on('connection', function (socket) {
        
            //this property shows the number of characters currently buffered to be written. (Number of characters is approximately equal to the number of bytes to be written, but the buffer may contain strings, and the strings are lazily encoded, so the exact number of bytes is not known.)
            //Users who experience large or growing bufferSize should attempt to "throttle" the data flows in their program with pause() and resume().
        
            // console.log('Buffer size : ' + socket.bufferSize);
        
            console.log('---------server details -----------------');
        
            var address = server.address();
            var port_ = address.port;
            var family = address.family;
            var ipaddr = address.address;
            console.log('Server is listening at port ' + port_);
            console.log('Server ip :' + ipaddr);
            console.log('Server is IP4/IP6 : ' + family);
        
            var lport = socket.localPort;
            var laddr = socket.localAddress;
            console.log('Server is listening at LOCAL port' + lport);
            console.log('Server LOCAL ip :' + laddr);
        
            console.log('------------remote client info --------------');
        
            var rport = socket.remotePort;
            var raddr = socket.remoteAddress;
            var rfamily = socket.remoteFamily;
        
            console.log('REMOTE Socket is listening at port' + rport);
            console.log('REMOTE Socket ip :' + raddr);
            console.log('REMOTE Socket is IP4/IP6 : ' + rfamily);
        
            console.log('--------------------------------------------')
            //var no_of_connections =  server.getConnections(); // sychronous version
            server.getConnections(function (error, count) {
                console.log('Number of concurrent connections to the server : ' + count);
            });
        
            socket.setEncoding('utf8');
            // socket.write('hello from server4');
        
            socket.setTimeout(800000, function () {
                // called after timeout -> same as socket.on('timeout')
                // it just tells that soket timed out => its ur job to end or destroy the socket.
                // socket.end() vs socket.destroy() => end allows us to send final data and allows some i/o activity to finish before destroying the socket
                // whereas destroy kills the socket immediately irrespective of whether any i/o operation is goin on or not...force destry takes place
                console.log('Socket timed out');
            });
        
        
            socket.on('data', function (data) {
                var bread = socket.bytesRead;
                var bwrite = socket.bytesWritten;
                // console.log('Bytes read : ' + bread);
                // console.log('Bytes written : ' + bwrite);
                console.log('Data received by NetServer : ' + data);

                io.emit('log_s', {type: 'info', msg: 'Data received: ' + data, when: new Date()})
        
                io.sockets.emit('received_msg', data);
        
                // socket.write('data received from server3');
                // socket.write(data + '   -   received from server');
            //   //echo data
                //   var is_kernel_buffer_full = socket.write('Data ::' + data);
                //   if(is_kernel_buffer_full){
                //     console.log('Data was flushed successfully from kernel buffer i.e written successfully!');
                //   }else{
                //     socket.pause();
                //   }
        
            });
        
            socket.on('drain', function () {
                console.log('write buffer is empty now .. u can resume the writable stream');
                socket.resume();
            });
        
            socket.on('error', function (error) {
                console.log('Error : ' + error);
            });
        
            socket.on('timeout', function () {
                console.log('Socket timed out !');
                socket.end('Timed out!');
                // can call socket.destroy() here too.
            });
        
            socket.on('end', function (data) {
                console.log('Socket ended from other end!');
                // console.log('End data : ' + data);
            });
        
            socket.on('close', function (error) {
                var bread = socket.bytesRead;
                var bwrite = socket.bytesWritten;
                console.log('onClose Bytes read : ' + bread);
                console.log('onClose Bytes written : ' + bwrite);
                console.log('Socket closed!\n\n');
                if (error) {
                    console.log('Socket was closed coz of transmission error');
                }
            });
        
            setTimeout(function () {
                var isdestroyed = socket.destroyed;
                console.log('Socket destroyed:' + isdestroyed);
                socket.destroy();
            }, 1200000);
        
        });
        
        // emits when any error occurs -> calls closed event immediately after this.
        server.on('error', function (error) {
            io.emit('log_s', {type: 'error', msg: 'Error : ' + error, when: new Date()})
            console.log('Error: ' + error);
        });
        
        //emits when server is bound with server.listen
        server.on('listening', function () {
            io.emit('log_s', {type: 'info', msg: 'net-Server is listening on port : ' + _port, when: new Date()})
            io.emit('listen', {status: true, when: new Date()})
            console.log('net Server is listening on port '+ _port);
        });
        
        server.maxConnections = 10;
        
        //static port allocation
        server.listen(_port);

        global.netServer = server;


    }
}


// // for dyanmic port allocation
// server.listen(function () {
//     var address = server.address();
//     var port = address.port;
//     var family = address.family;
//     var ipaddr = address.address;
//     console.log('Server is listening at port' + port);
//     console.log('Server ip :' + ipaddr);
//     console.log('Server is IP4/IP6 : ' + family);
// });



// var islistening = server.listening;

// if (islistening) {
//     console.log('Server is listening');
// } else {
//     console.log('Server is not listening');
// }

// setTimeout(function () {
//     server.close();
// }, 5000000);

