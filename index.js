var express        = require('express');
global._           = require('underscore');

var app = express();

app.use(require('./router'));

app.set('etag', false);

var server = require('http').createServer(app);

server.listen(8081, function(){
    require('./socketio')(server);
    // require('./netServer')
    console.log('HTTP server is ready on port ' + 8081 + ' on ' + app.get('env'));
    
});

// require('./netClient')