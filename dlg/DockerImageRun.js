var exec = require('child_process').exec;

exports.do = function(data) {

  return new Promise(function(success, failure) {

    console.log("[" + data.microservice + "] - Starting Docker image... ");

    var command = '';

    // Remove the microservice if it exists
    command += 'docker stop ' + data.microservice + ' || true; ';
    command += 'docker rm ' + data.microservice + ' || true; ';
    command += 'docker rmi nicolasances/' + data.microservice + ' || true; ';

    // Define additional parameters in case of specific microservices
    // TODO

    // Run the microservice
    command += 'docker run -d --network totonet --name ' + data.microservice + ' --restart always nicolasances/' + data.microservice + ':latest';

    exec(command, function(err) {

      if (err) {
        console.log("[" + data.microservice + "] - Error starting Docker image! ");
        console.log(err);
        failure();
        return;
      }

      console.log("[" + data.microservice + "] - Docker image successfully started! ");

      success();

    });

  });
}
