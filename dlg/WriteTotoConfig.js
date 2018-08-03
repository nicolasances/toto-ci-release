var fs = require('fs');

exports.do = function(data) {

  console.log('[' + data.microservice + '] - Creating config.js file...');

  return new Promise(function(success, failure) {

    console.log(data);

    // 1. Retrieve microservice from GitHub
    console.log('[' + data.microservice + '] - Creating config.js file...');

    var protocol = data.ssl ? 'https' : 'http';
    var port = data.ssl ? '443' : '80';
    var host = data.host;

    // 2. Create the configuration file
    var data = '';

    data += 'var microservicesProtocol = "' + protocol + '"; \r\n';
    data += 'var microservicesHost = "' + host + '"; \r\n';
    data += 'var microservicesPort = "' + port + '"; \r\n';
    data += 'var microservicesUrl = "' + host + '"; \r\n';
    data += 'var microservicesUrl2 = "' + host + '"; \r\n';

    // Write
    fs.writeFile('/' + data.microservice + '/toto/conf/config.js', data, function(err, data) {

      if (err) {
        console.log('[' + data.microservice + '] - Error creating the config.js file!');
        failure(err);
        return;
      }

      console.log('[' + data.microservice + '] - config.js file created!');

      success();

    });

  });
}
