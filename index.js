var express = require('express');
var Promise = require('promise');
var bodyParser = require("body-parser");

var postRelease = require('./dlg/PostRelease');

var apiName = 'ci-release';

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, GoogleIdToken");
  res.header("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
  next();
});
app.use(bodyParser.json());
app.use(express.static('/app'));

/**
 * Smoke test api
 */
app.get('/', function(req, res) {res.send({api: apiName, status: 'running'});});

app.post('/releases', function(req, res) {

  postRelease.do(req.body).then(function(result) {res.status(200).send(result);}, function(result) {res.status(500).send(result)});

});

app.get('/releases/:microserviceId', function(req, res) {

  postRelease.getStatus(req.path.microserviceId).then((result) => {

    res.status(200).send(result);

  }, (err) => {res.status(500).send(err)};)
});

app.listen(8080, function() {
  console.log('Toto CI Release Microservice up and running');
});
