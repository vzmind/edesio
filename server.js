var express = require('express')
  , bodyParser = require('body-parser')
  , methodOverride = require('method-override')
  , static = require('serve-static')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , routes = require('./routes')
  , socket = require('./routes/socket.js')
  , mongoose = require('mongoose');
  , io = require('socket.io').listen(server);

    app.use(bodyParser());
    app.use(methodOverride());
    app.use(static(__dirname + '/public'));



// Heroku config only
if(process.env.PORT) {
  io.configure(function () { 
    io.set("transports", ["xhr-polling"]); 
    io.set("polling duration", 10); 
  });  
}


// Configuration
var config = require('./config')(app, express);


// Routes
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Socket.io Communication

io.sockets.on('connection', socket);

// Start server
var port = process.env.PORT || 5000;

server.listen(port);