var setupAPIGateway = require('./SetupAPIGateway');
var tykGetAPIDefinition = require('./TykGetAPIDefinition');
var tykCreateAPI = require('./TykCreateAPI');
var tykReload = require('./TykReload');

exports.do = function(data) {

  return new Promise(function(success, failure) {

    // 1. Check, using the Tyk APIs, if the API definition exists in Tyk
    tykGetAPIDefinition.do(data).then((result) => {

      if (result.found) {

        // Success!!
        success({tykUpdated: false});

        // Return
        return;
      }

      console.log('[' + data.microservice + '] The API does not exist in Tyk. Creating API');

      // 2. Otherwise add the api to tyk
      tykCreateAPI.do(data).then(() => {

        // 3. Reload the gateway
        tykReload.do(data);

      }).then(() => {

        success({tykUpdated: true});

      });

    });

  });

}
