var http = require('request');

exports.do = function(data) {

  return new Promise(function(success, failure) {

    console.log('[' + data.microservice + '] Tyk API Gateway : performing hot reload of the gateway...');

    // Prepare the gateway reload
    var tykRequest = {
      url : "http://gateway:8080/tyk/reload",
      method: 'GET',
      headers : {
        'User-Agent' : 'node.js',
        'x-tyk-authorization': 'totocazzo'
      }
    };

    // Reload the gateway
    http(tykRequest, function(err, resp, body) {

      if (err) {
        console.log(err);
        failure(err);
        return;
      }

      console.log('[' + data.microservice + '] Tyk API Gateway : gateway reloaded!');

      success();

    });

  })
}
