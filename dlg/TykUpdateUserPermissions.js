var http = require('request');

// Create the Tyk user
exports.do = function(apiUser, data) {

  return new Promise(function(success, error) {

    console.log('[' + data.microservice + '] Tyk - Updating user permissions. User: ' + process.env.TOTOAPIUSER);

    // Create the access_rights object
    apiUser.access_rights[data.microservice] = {
      api_id: data.microservice,
      api_name: data.name,
      versions: ["Default"]
    }

    // Update the user password
    apiUser.basic_auth_data.password = process.env.TOTOAPIPSWD;

    // Update the user on Tyk (it's a POST, i know, but it works like that... PUT doesn't seem to work)
    var tykRequest = {
      url : "http://gateway:8080/tyk/keys/" + process.env.TOTOAPIUSER,
      method: 'POST',
      headers : {
        'User-Agent' : 'node.js',
        'x-tyk-authorization': 'totocazzo',
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(apiUser)
    };

    http(tykRequest, function(error, response, body) {

      if (error) {
        failure(error);
        return;
      }

      console.log('[' + data.microservice + '] Tyk - User updated!');

      success();

    });

  })
}
