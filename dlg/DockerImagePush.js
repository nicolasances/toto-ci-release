var exec = require('child_process').exec;

exports.do = function(data) {

  return new Promise(function(success, failure) {

    console.log("[" + data.microservice + "] - Pushing Docker image... ");

    // Login
    command += 'docker login -u ' + data.dockerhubUser + ' -p ' + data.dockerhubPwd + ' ;';

    // Push
    command += 'docker push ' + data.dockerhubUser + '/' + data.microservice;

    exec(command, function(err) {

      if (err) {
        console.log("[" + data.microservice + "] - Error pushing Docker image! ");
        console.log(err);
        failure();
        return;
      }

      console.log("[" + data.microservice + "] - Docker image successfully pushed! ");

      success();

    });

  });
}
