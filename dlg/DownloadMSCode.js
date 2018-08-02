var exec = require('child_process').exec;

exports.do = function(repositoryName) {

  return new Promise(function(success, failure) {

    var command = 'git clone https://github.com/nicolasances/' + repositoryName + ' /' + repositoryName + '; ';

    console.log("[" + repositoryName + "] - Getting code from Github");

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
