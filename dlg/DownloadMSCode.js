var exec = require('child_process').exec;

exports.do = function(data) {

  return new Promise(function(success, failure) {

    console.log("[" + data.microservice + "] - Getting code from Github");

    // Create the command
    var command = ''

    // Remove the folder if any
    command += 'rm -r /' + data.microservice + '; ';

    // Clone the git repository
    command += 'git clone https://github.com/nicolasances/' + data.microservice + '.git /' + data.microservice + '; ';

    exec(command, function(err, stdout, stderr) {

      if (err) {
        console.log("[" + data.microservice + "] - Error: " + err);
        failure(err);
        return;
      }

      console.log("[" + data.microservice + "] - Code from Github downloaded!");

      success(data);

    });

  });
}
