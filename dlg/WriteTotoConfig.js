var fs = require('fs');

exports.do = function(data) {

  var config = data;

  return new Promise(function(success, failure) {

    // 1. Retrieve microservice from GitHub
    console.log('[' + config.microservice + '] - Creating config.js file...');

    var protocol = config.ssl ? 'https' : 'http';
    var port = config.ssl ? '443' : '80';
    var host = config.host;

    // 2. Create the configuration file
    var data = '';

    data += 'var microservicesProtocol = "' + protocol + '"; \r\n';
    data += 'var microservicesHost = "' + host + '"; \r\n';
    data += 'var microservicesPort = "' + port + '"; \r\n';
    data += 'var microservicesUrl = "' + host + '"; \r\n';
    data += 'var microservicesUrl2 = "' + host + '"; \r\n';

    // Write
    fs.writeFile('/' + config.microservice + '/toto/conf/config.js', data, function(err, data) {

      if (err) {
        console.log('[' + config.microservice + '] - Error creating the config.js file!');
        failure(err);
        return;
      }

      console.log('[' + config.microservice + '] - config.js file created!');

      success(config);

    });

  });
}
