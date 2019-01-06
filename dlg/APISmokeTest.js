var http = require('request');

// Checks if the API is deployed on the API Gateway
// If it is, it will return a success, otherwise a failure
exports.do = function(data) {

  return new Promise(function(success, failure) {

    console.log('[' + data.microservice + '] - Smoke testing API: http://gateway:8080/' + data.name + '/' );

    var protocol = process.env.SERVERSSL == true ? 'https' : 'http';
    var host = process.env.SERVERHOST;

    var url = protocol + '://' + host + '/apis/' + data.name + '/';

    // Create the http request to query the data
    var req = {
      url: url,
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + new Buffer(process.env.TOTOAPIUSER + ':' + process.env.TOTOAPIPSWD).toString('base64'),
        'Accept': 'application/json'
      }
    }

    // Call the API and check the status
    http(req, function(err, resp, body) {

      // If there's a problem
      if (err || resp == null || resp.statusCode == 404 || body == null || JSON.parse(body).status != 'running') {
        console.log('[' + data.microservice + '] - Smoke test failed.');
        if (resp != null && resp.statusCode == 404) console.log('[' + data.microservice + '] - Received 404');
        else if (body == null) console.log('[' + data.microservice + '] - No body received');
        else console.log('[' + data.microservice + '] - Body: ' + body);
        failure();
      }
      else {
        console.log('[' + data.microservice + '] - Smoke test succeeded!');
        success();
      }

    });

  });

}
