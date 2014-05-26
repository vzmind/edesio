var express = require('express')
  , bodyParser = require('body-parser')
  , methodOverride = require('method-override')
  , static = require('serve-static')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , routes = require('./routes')
  , socket = require('./routes/socket.js')
  , tasks = require('./routes/tasks.js')
  , mongoose = require('mongoose')
  , io = require('socket.io').listen(server);

	mongoose.connect('mongodb://heroku:lztmxvYb7dADz8onozQFzF9sQbm_xtb3NoMml5fLvYiOb3hAc7fx1b7idwBXoXXDnASvKswshHuGeFTkuEJ5Yg@oceanic.mongohq.com:10010/app25675009'); 	// connect to mongoDB database on Heroku

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

var router = express.Router();

// define model =================
var Todo = mongoose.model('Todo', {
	text : String
});

// Routes
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);


// api ---------------------------------------------------------------------
// get all todos
app.get('/api/todos', function(req, res) {

	// use mongoose to get all todos in the database
	Todo.find(function(err, todos) {

		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err)
			res.send(err)

		res.json(todos); // return all todos in JSON format
	});
});

// create todo and send back all todos after creation
app.post('/api/todos', function(req, res) {

	// create a todo, information comes from AJAX request from Angular
	Todo.create({
		text : req.body.text,
		done : false
	}, function(err, todo) {
		if (err)
			res.send(err);

		// get and return all the todos after you create another
		Todo.find(function(err, todos) {
			if (err)
				res.send(err)
			res.json(todos);
		});
	});

});

// delete a todo
app.delete('/api/todos/:todo_id', function(req, res) {
	Todo.remove({
		_id : req.params.todo_id
	}, function(err, todo) {
		if (err)
			res.send(err);

		// get and return all the todos after you create another
		Todo.find(function(err, todos) {
			if (err)
				res.send(err)
			res.json(todos);
		});
	});
});

// Socket.io Communication

io.sockets.on('connection', socket);



// Start server
var port = process.env.PORT || 5000;

server.listen(port);