var http = require('request');

exports.do = function(data) {

  return new Promise(function(success, failure) {

      // Prepare the gateway reload
      var data = {
        url : "http://gateway:8080/tyk/apis/" + data.name,
        method: 'GET',
        headers : {
          'User-Agent' : 'node.js',
          'x-tyk-authorization': 'totocazzo'
        }
      };

      // Call API
      http(data, function(err, resp, body) {

        // Parse body
        var apiStatus = JSON.parse(body);

        if (apiStatus.api_id != null && apiStatus.api_id == data.name) {

          // Success!
          success({found: true});

          // Return
          return;
        }

        success({found: false});

      });

  });

}
