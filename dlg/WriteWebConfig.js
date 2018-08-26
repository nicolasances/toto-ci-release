var fs = require('fs');

exports.do = function(data) {

  return new Promise(function(success, failure) {

    // 1. Retrieve microservice from GitHub
    console.log('[' + data.microservice + '] - Creating config.js file...');

    var protocol = process.env.SERVERSSL == 'true' ? 'https' : 'http';
    var port = process.env.SERVERSSL == 'true' ? '443' : '80';
    var host = process.env.SERVERHOST;

    // 2. Create the configuration file
    var file = '';

    file += 'var apiUrl = "' + protocol + '://' + host + ':' + port + '/apis"; \r\n';
    file += 'var apiBasicAuthToken = "' + new Buffer(process.env.TOTOAPIUSER + ':' + process.env.TOTOAPIPSWD).toString('base64') + '"';

    // Write
    fs.writeFile('/' + data.microservice + '/www/conf/conf.js', file, function(err, res) {

      if (err) {
        console.log('[' + data.microservice + '] - Error creating the config.js file!');
        failure(err);
        return;
      }

      console.log('[' + data.microservice + '] - config.js file created!');

      success(data);

    });

  });
}
