var smokeTestAPI = require('./APISmokeTest');
var setupNGINX = require('./SetupNGINX');
var setupAPIGateway = require('./SetupAPIGateway');

exports.do = function(data) {

  return new Promise(function(success, failure) {

    if (data.skipNGINXreconfig) {
      success({nginxUpdated: false, tykUpdated: false});
      return;
    }

    setTimeout(() => {

      // 1. Check if this is a new releaes
      // in case it is, release the new API on the CA API Gateway and reconfigure NGINX
      smokeTestAPI.do(data).then(() => {
        // Success
        // Just return saying you did not update NGINX nor Tyk
        success({nginxUpdated: false, tykUpdated: false});

      }, (e) => {

        console.log('[' + data.microservice + '] Failue in smoke test received' + e);

        // Failure
        // 2. Add the new microservice to the API Gateway
        setupAPIGateway.do(data).then(() => {

          // 2. Add the new microservice to NGINX
          return setupNGINX.do(data);

        }).then(() => {

          // Return
          success({nginxUpdated: true, tykUpdated: true});

        });

      })

    }, 2000);

  });

}
