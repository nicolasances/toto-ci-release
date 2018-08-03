
var releaseToto = require('./ReleaseToto');

// Requires a payload object
// { microservice: <name of the microservice, e.g. toto-nodems-expenses or toto>
//   host: <name of the host, can be an IP address, or a host name>
//   ssl : <true or false> optional, defaulted to false}
exports.do = function(conf) {

  return new Promise(function(success, failure) {

    // 1. Validate input
    // Must contain host
    if (conf.host == null) {failure({error: 'No <host> parameter passed in the body'}); return;}

    // Must contain microservice
    if (conf.microservice == null) {failure({error: 'No <microservice> parameter passed in the body'}); return;}

    console.log('Starting release process for Microservice ' + conf.microservice);

    // 2. Check what type of microservice it is
    // If it's the toto webapp (toto)
    if (conf.microservice == 'toto') {releaseToto.do(conf).then(function() {console.log('finished'); success();}, failure);}

    // TODO: if it's a web application (generic toto-ui-)
    else if (conf.microservice.startsWith('toto-ui-')) {failure({error: 'Not implemented'});}

    // If it's a NodeJS microservice (toto-nodems-)
    else if (conf.microservice.startsWith('toto-nodems-')) {failure({error: 'Not implemented'});}

    // If it's a Java microservice (toto-ms-)
    else if (conf.microservice.startsWith('toto-ms-')) {failure({error: 'Not implemented'});}

    // If it's a CI microservice (toto-ci)
    else if (conf.microservice.startsWith('toto-ci-')) {failure({error: 'Not implemented'});}

    // If it's an unknown Microservice
    else {failure({error: 'Can\'t release this Microservice: unknown type: ' + conf.microservice});}

  });

}
