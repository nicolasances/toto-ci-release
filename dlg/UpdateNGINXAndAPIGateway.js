var smokeTestAPI = require('./TykAPISmokeTest');
var tykCreateAPI = require('./TykCreateAPI');
var tykUpdateUser = require('./TykUpdateUser');
var setupNGINX = require('./SetupNGINX');

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
        tykCreateAPI.do(data).then(() => {

          // 3. Update the Tyk user
          return tykUpdateUser.do(data);

        }).then(() => {

          // 3. Add the new microservice to NGINX
          return setupNGINX.do(data);

        }).then(() => {

          // Return
          success({nginxUpdated: true, tykUpdated: true});

        });

      })

    }, 2000);

  });

}
