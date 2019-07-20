var exec = require('child_process').exec;

exports.do = function(data) {

  return new Promise(function(success, failure) {

    console.log("[" + data.microservice + "] - Starting Docker image... ");

    var command = '';

    // Define additional parameters in case of specific microservices
    // TODO

    // Remove the microservice if it exists
    command += 'docker stop ' + data.microservice + ' || true; ';
    command += 'docker rm ' + data.microservice + ' || true; ';

    // Run the microservice
    command += 'docker run -d --network totonet --name ' + data.microservice + ' -v /keys:/keys -e GOOGLE_APPLICATION_CREDENTIALS=/keys/pubsub.json --restart always nicolasances/' + data.microservice + ':latest';

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
