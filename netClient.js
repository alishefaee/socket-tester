
var net = require('net');
const { isObject } = require('underscore');

module.exports = {
    send(host, port, msg){

        console.log('sending data:', msg);


        //---------------------client----------------------

        // creating a custom socket client and connecting it....
        var client = new net.Socket();
        client.connect({host,port});

        io.emit('log_c', {type: 'info', msg: 'Connecting to:' + host+':'+port, when: new Date()})

        client.on('connect', function () {
            io.emit('log_c', {type: 'success', msg: 'Connection established with server: ' + host+':'+port, when: new Date()})

            console.log('Client: connection established with server');

            console.log('---------client details -----------------');
            var address = client.address();
            var port_ = address.port;
            var family = address.family;
            var ipaddr = address.address;
            console.log('Client is listening at port' + port_);
            console.log('Client ip :' + ipaddr);
            console.log('Client is IP4/IP6 : ' + family);


            // writing data to server
            // client.write(['Step1  ' + new Date().toLocaleTimeString(),'l']);
            // io.emit('log_c', {type: 'info', msg: 'Address: ' + ipaddr+'  Port: ' + port_, when: new Date()})
            
            setTimeout(() => {
                io.emit('log_c', {type: 'info', msg: 'Write: ' + msg, when: new Date()})
                client.write(msg);
            }, 3000);

        });

        // client.setEncoding('utf8');

        client.on('data', function (data) {
            io.emit('log_c', {type: 'info', msg: 'Data from server: ' + data, when: new Date()})
            console.log('Data from server:' + data);
            // if(data.indexOf('Step1') != -1)
                // client.write('End');
        });

        client.on('error', function (error) {
            io.emit('log_c', {type: 'error', msg: 'Error : ' + error, when: new Date()})
            console.log('Error on server : ' + error);
        });

        client.on('timeout', function () {
            io.emit('log_c', {type: 'warning', msg: 'Socket Server timed out, ending connection. ', when: new Date()})
            console.log('Socket Server timed out !');
            client.end('Server Timed out!');
            // can call socket.destroy() here too.
        });

        client.on('end', function (data) {
            io.emit('log_c', {type: 'warning', msg: 'Socket Server ended from other end.', when: new Date()})
            console.log('Socket Server ended from other end.');
            // console.log('Server End data : ' + data);
        });

        client.on('close', function (error) {
            io.emit('log_c', {type: 'error', msg: 'Closed. error: ' + error, when: new Date()})
            if (error) {
                console.log('Socket Server was closed coz of transmission error');
            }
        });

        // setTimeout(function () {
        //     // client.end('Bye bye server');
        // }, 5000);

    }
}