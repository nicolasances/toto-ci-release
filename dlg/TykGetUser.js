var http = require('request');
var getUserKey = require('./TykGetUserKey');

// Create the Tyk user
exports.do = function(conf) {

  return new Promise(function(success, error) {

    getUserKey.do().then((key) => {

      console.log('[' + data.microservice + '] Retrieved user key: ' + JSON.stringify(key));

      if (key == null || key.key == null) {
        failure();
        return;
      }

      // Create the user on Tyk
      var data = {
        url : "http://gateway:8080/tyk/keys/" + key.key,
        method: 'GET',
        headers : {
          'User-Agent' : 'node.js',
          'x-tyk-authorization': 'totocazzo'
        }
      };

      http(data, function(error, response, body) {

        if (error) {
          failure(error);
          return;
        }

        // Check if the user is there
        let tykResponse = JSON.parse(body);

        if (tykResponse.status == 'error') failure(tykResponse);
        else success();

      });

    });

  });
}
