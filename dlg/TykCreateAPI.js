var http = require('request');

exports.do = function(api) {

  return new Promise(function(success, failure) {

    // The listen path will be the name of the api with / instead of -
    // This because tyk doesn't handle well the - and tends to append the api_id in some cases
    var listenPath = api.name.replace(/-/g, '/');

    // Build the JSON object to send to Tyk
    var tykApi = {
      "name": api.name,
      "slug": api.name,
      "api_id": api.microservice,
      "org_id": "53ac07777cbb8c2d53000002",
      "use_keyless": false,
      "use_basic_auth": true,
      "enable_jwt": false,
      "auth": {
        "auth_header_name": "Authorization"
      },
      "definition": {
        "location": "header",
        "key": "x-api-version"
      },
      "version_data": {
        "not_versioned": true,
        "versions": {
          "Default": {
            "name": "Default",
            "use_extended_paths": true
          }
        }
      },
      "CORS": {
        "enable": false,
        "allowed_origins": [
          "*"
        ],
        "allowed_methods": ["OPTIONS", "GET", "PUT", "POST", "DELETE"],
        "allowed_headers": ["Accept", "Content-Type", "Authorization"],
        "exposed_headers": [],
        "allow_credentials": false,
        "max_age": 24,
        "options_passthrough": true,
        "debug": false
      },
      "proxy": {
        "listen_path": "/" + listenPath + "/",
        "target_url": "http://" + api.microservice + ":8080/",
        "strip_listen_path": true
      },
      "active": true,
      "domain": ""
    }

    // Create the API on Tyk by calling the HTTP API
    var data = {
      url : "http://gateway:8080/tyk/apis",
      method: 'POST',
      headers : {
        'User-Agent' : 'node.js',
        'x-tyk-authorization': 'totocazzo',
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(tykApi)
    };

    console.log('[' + api.microservice + '] Creating Tyk API ' + api.name + " - " + api.microservice);

    http(data, function(error, response, body) {

      // Check that the API was actually created
      // If the API was created, the body will contain a "key" field and a "status: ok"
      let tykResponse = JSON.parse(body);

      if (tykResponse.key == api.microservice && tykResponse.status == 'ok') success({tykResponse});
      else failure({tykResponse});

    });

  });

}
