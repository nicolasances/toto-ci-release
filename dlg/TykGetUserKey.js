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

      let getKeyResp;

      // If the body is empty use the default key builder.
      // It could still fail, but if the pattern that Tyk uses to build keys stays the same, it could be ok
      if (body == null) getKeyResp = {key: '53ac07777cbb8c2d53000002' + process.env.TOTOAPIUSER}
      else getKeyResp = JSON.parse(body);

      if (getKeyResp.key == null) failure();
      else {

        // Save the key
        key = getKeyResp;

        success(getKeyResp);
      }

    });

  });

}
