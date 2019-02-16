var fs = require('fs');

exports.do = function(data) {

  return new Promise(function(success, failure) {

    // 1. Retrieve microservice from GitHub
    console.log('[' + data.microservice + '] - Creating environment.prod.ts file...');

    var protocol = process.env.SERVERSSL == 'true' ? 'https' : 'http';
    var port = process.env.SERVERSSL == 'true' ? '443' : '80';
    var host = process.env.SERVERHOST;

    // 2. Create the configuration file
    var file = '';

    file += 'export const environment = { \r\n';
    file += ' production: true, \r\n';
    file += ' api: { \r\n';
    file += '  host: "' + protocol + '://' + host + ':' + port + '", \r\n';
    file += '  auth: "Basic ' + new Buffer(process.env.TOTOAPIUSER + ':' + process.env.TOTOAPIPSWD).toString('base64') + '" \r\n';
    file += ' } \r\n';
    file += '}; \r\n';

    // Write
    fs.writeFile('/' + data.microservice + '/src/environments/environment.prod.ts', file, function(err, res) {

      if (err) {
        console.log('[' + data.microservice + '] - Error creating the environment.prod.ts file!');
        failure(err);
        return;
      }

      console.log('[' + data.microservice + '] - environment.prod.ts file created!');

      success(data);

    });

  });
}
