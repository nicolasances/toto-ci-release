var exec = require('child_process').exec;

// The nested parameter (true or false or null) is there to specify whether
// the microservice on github has a nested folder under the root ... old microservices
exports.do = function(data, nested) {

  return new Promise(function(success, failure) {

    console.log("[" + data.microservice + "] - Building Docker image... ");

    // Where is the docker file?
    var dockerFileFolder = '/' + data.microservice;

    // Is the microservice folder structure normal or nested?
    if (nested) dockerFileFolder += '/' + data.microservice;

    var command = '';

    // Remove the microservice if it exists
    command += 'docker stop ' + data.microservice + ' || true; ';
    command += 'docker rm ' + data.microservice + ' || true; ';

    // Remove the image and build it
    command += 'docker rmi nicolasances/' + data.microservice + ' || true; ';
    command += 'docker build -t nicolasances/' + data.microservice + ' ' + dockerFileFolder;

    var justBuild = function() {

      var cmd = 'docker build -t nicolasances/' + data.microservice + ' ' + dockerFileFolder;

      exec(command, function(err) {

        if (err) {
          console.log("[" + data.microservice + "] - Error building Docker image! ");
          console.log(err);
          failure();
          return;
        }

        success();

      });
    }

    exec(command, function(err) {

      if (err) {
        if (err.indexOf('No such container') >= 0) {
          justBuild();
          return;
        }
      }

      console.log("[" + data.microservice + "] - Docker image successfully built! ");

      success();

    });

  });
}
