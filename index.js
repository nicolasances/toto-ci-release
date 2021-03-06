var express = require('express');
var Promise = require('promise');
var bodyParser = require("body-parser");

var postRelease = require('./dlg/PostRelease');

var apiName = 'release';

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
  next();
});
app.use(bodyParser.json());
app.use(express.static('/app'));

/**
 * Smoke test api
 */
app.get('/', function(req, res) {res.send({api: apiName, status: 'running'});});

/**
 * Release a microservice
 */
app.post('/releases', function(req, res) {

  postRelease.do(req.body);

  res.status(201).send();

});

/**
 * Check the status of the release of a microservice
 */
app.get('/releases/:microserviceId', function(req, res) {

  postRelease.getStatus(req.params.microserviceId).then((result) => {
    res.status(200).send(result);
  });

});

app.listen(8080, function() {
  console.log('Toto CI Release Microservice up and running');
});
