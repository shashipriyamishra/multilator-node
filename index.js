var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'shashi',
	database : 'nodelogin'
});
connection.connect(function(err){
	if(!err) {
		console.log("Database is connected");
	} else {
		console.log("Error while connecting with database");
	}
	});


var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', function (request, response) {

	debugger;
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		console.log('hi1');
		connection.query(`SELECT * FROM accounts WHERE username = '${username}' AND password = '${password}'`, [username, password], function (error, results, fields) {
			console.log('res',results);
			if (results && results.length > 0) {
				debugger;
				console.log('hires');
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('http://localhost:3000');
			} else {
				debugger;
				console.log('hierr');
				response.send('Incorrect Username and/or Paswod!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Passwod!');
		response.end();
	}
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

app.listen(3000);