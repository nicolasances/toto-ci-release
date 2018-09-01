
var releaseNodems = require('./ReleaseNodems');
var releaseMs = require('./ReleaseMs');
var releaseWebapp = require('./ReleaseWebapp');

// Requires a payload object
// { microservice: <name of the microservice, e.g. toto-nodems-expenses or toto>
//   host: <name of the host, can be an IP address, or a host name>
//   ssl : <true or false> optional, defaulted to false}
exports.do = function(conf) {

  return new Promise(function(success, failure) {

    // 1. Validate input
    // Must contain microservice
    if (conf.microservice == null) {failure({error: 'No <microservice> parameter passed in the body'}); return;}

    // 2. Setting Dockerhub credentials
    conf.dockerhubUser = process.env.DOCKERHUBUSR;
    conf.dockerhubPwd = process.env.DOCKERHUBPWD;

    console.log('[' + conf.microservice + '] - Starting release process for Microservice ' + conf.microservice);

    // 3. Check what type of microservice it is
    // If it's a web application (generic toto-web-)
    if (conf.microservice.startsWith('toto-web-') || conf.microservice == 'toto') {releaseWebapp.do(conf).then(success, failure);}

    // If it's a NodeJS microservice (toto-nodems-)
    else if (conf.microservice.startsWith('toto-nodems-')) {releaseNodems.do(conf).then(function() {success();}, failure);}

    // If it's a Java microservice (toto-ms-)
    else if (conf.microservice.startsWith('toto-ms-')) {releaseMs.do(conf).then(function() {success();}, failure);}

    // If it's a CI microservice (toto-ci)
    else if (conf.microservice.startsWith('toto-ci-')) {failure({error: 'Not supposed to be released like this! Should be part of the Environment Setup init.sh'});}

    // If it's an unknown Microservice
    else {failure({error: 'Can\'t release this Microservice: unknown type: ' + conf.microservice});}

  });

}

exports.getStatus = function(microservice) {

  if (microservice.startsWith('toto-nodems-')) return releaseNodems.getStatus(microservice);
  else if (microservice.startsWith('toto-web-') || microservice == 'toto') return releaseWebapp.getStatus(microservice);
  else return new Promise(function(s, f) {s({microservice: microservice, status: 'RELEASED'});});
}
