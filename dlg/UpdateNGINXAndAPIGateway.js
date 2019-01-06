var smokeTestAPI = require('./TykAPISmokeTest');
var tykCreateAPI = require('./TykCreateAPI');
var setupNGINX = require('./SetupNGINX');

exports.do = function(data) {

  return new Promise(function(success, failure) {

    // 1. Check if this is a new releaes
    // in case it is, release the new API on the CA API Gateway and reconfigure NGINX
    smokeTestAPI.do(data).then(() => {
      // Success
      // Just return saying you did not update NGINX nor Tyk
      success({nginxUpdated: false, tykUpdated: false});

    }, () => {
      // Failure
      // 2. Add the new microservice to the API Gateway
      tykCreateAPI.do(data).then(() => {

        // 3. Add the new microservice to NGINX
        return setupNGINX.do(data);

      }).then(() => {

        // Return
        success({nginxUpdated: true, tykUpdated: true});

      });

    })

  });

}
