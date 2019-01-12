var http = require('request');

var key = null;

exports.do = function() {

  return new Promise(function(success, failure) {

    if (key != null) {
      success(key);
      return;
    }

    // Prepare the gateway reload
    var req = {
      url : "http://toto-environment-setup:8080/key",
      method: 'GET',
      headers : {}
    };

    // Reload the gateway
    http(req, function(err, resp, body) {

      let getKeyResp = JSON.parse(body);

      if (getKeyResp.key == null) failure();
      else {

        // Save the key
        key = getKeyResp;

        success(getKeyResp);
      }

    });

  });

}
