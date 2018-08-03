var exec = require('child_process').exec;

exports.do = function(repositoryName) {

  return new Promise(function(success, failure) {

    console.log("[" + repositoryName + "] - Getting code from Github");

    // Create the command
    var command = ''

    // Remove the folder if any
    command += 'rm -r /' + repositoryName + '; ';

    // Clone the git repository
    command += 'git clone https://github.com/nicolasances/' + repositoryName + '.git /' + repositoryName + '; ';

    exec(command, function(err, stdout, stderr) {

      if (err) {
        console.log("[" + repositoryName + "] - Error: " + err);
        failure(err);
        return;
      }

      console.log("[" + repositoryName + "] - Code from Github downloaded!");

      success();

    });

  });
}
