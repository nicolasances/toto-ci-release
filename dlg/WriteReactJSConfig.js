var fs = require('fs');

exports.do = function(data) {

  return new Promise(function(success, failure) {

    // 1. Retrieve microservice from GitHub
    console.log('[' + data.microservice + '] - Creating environment.prod.ts file...');

    var protocol = process.env.SERVERSSL == 'true' ? 'https' : 'http';
    var port = process.env.SERVERSSL == 'true' ? '443' : '80';
    var host = process.env.SERVERHOST;

    let apiUrl = protocol + '://' + host + ':' + port + '/apis';
    let auth = 'Basic ' + new Buffer(process.env.TOTOAPIUSER + ':' + process.env.TOTOAPIPSWD).toString('base64');

    // 2. Create the configuration file
    var file = '';

    file += "export const apiUrl = '" + apiUrl + "'; \r\n"
    file += "export const auth = '" + auth + "'; \r\n"

    // Write
    fs.writeFile('/' + data.microservice + '/src/env.js', file, function(err, res) {

      if (err) {
        console.log('[' + data.microservice + '] - Error creating the env.js file!');
        failure(err);
        return;
      }

      console.log('[' + data.microservice + '] - env.js file created!');

      success(data);

    });

  });
}
