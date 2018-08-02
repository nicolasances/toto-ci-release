var exec = require('child_process').exec;

exports.do = function(data) {

  return new Promise(function(success, failure) {

    console.log("[" + data.microservice + "] - Building Docker image... ");

    var command = 'docker build -t nicolasances/' + data.microservice + ' .';

    exec(command, function(err) {

      if (err) {
        console.log("[" + data.microservice + "] - Error building Docker image! ");
        console.log(err);
        failure();
        return;
      }

      console.log("[" + data.microservice + "] - Docker image successfully built! ");

      success();

    });

  });
}
