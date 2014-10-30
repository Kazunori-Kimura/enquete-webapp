// app.js
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

// route
var enquete = require('./routes/enquete.js');

// view
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.render('index', { title: 'INDEX' });
});

app.get('/edit', function(req, res){
  res.render('edit', { title: 'EDIT' });
});

app.get('/enquete', enquete.findAll);

var server = app.listen(3000);
