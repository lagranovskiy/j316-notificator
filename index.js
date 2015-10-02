var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');

var mongoose = require('mongoose');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var config = require('./config/config');


// set up our express application
app.use(morgan((config.env === 'dev') ? 'dev' : 'tiny')); // log every request to the console

app.use(bodyParser.json()); // get information from html forms
app.use(methodOverride()); // simulate DELETE and PUT
app.use(cookieParser('')); // read cookies (needed for auth)


// load all mongoose models
fs.readdirSync(path.join(__dirname,'api', 'model')).forEach(function (file) {
    require('./api/model/' + file);
});

// bootstrap db connection
mongoose.connect(config.mongoDB, function (err) {
    if (err) {
        console.error(err, 'Could not connect to MongoDB!');
    } else {
        console.info('Connected to MongoDB: ' + config.mongoDB);
    }
});

require('./api/routes')(app);

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
    response.render('pages/index');
});


app.listen(config.httpPort, function () {
    console.log('Node app is running on port', config.httpPort);
});


