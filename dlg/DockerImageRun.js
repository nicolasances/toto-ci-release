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

    // ENVIRONMENT VARIABLES
    // Google Application Crendetials
    googleApplicationCredentials = "/keys/toto-microservice-" + process.env.SERVERENV + ".json";

    // TOTO_API_AUTH - Authentication Env Var
    totoApiAuthEnvVar = '"Basic ' + new Buffer(process.env.TOTOAPIUSER + ':' + process.env.TOTOAPIPSWD).toString('base64') + '"';

    // TOTO_HOST - Host
    totoHostEnvVar = process.env.SERVERHOST;

    // TOTO_EVENTS_GCP_PROJECT_ID - Project ID for the Google Project that holds the pubsub broker
    eventsGCPProjectEnvVar = 'toto-events-' + process.env.SERVERENV.toLowerCase();

    // TOTO_ENV
    envEnvVar = process.env.SERVERENV.toLowerCase();

    // Log rotation
    logRotation = ' --log-opt max-size=10m --log-opt max-file=5 ';

    // Run command
    command += 'docker run -d --network totonet --name ' + data.microservice + ' -v /keys:/keys -e TOTO_ENV=' + envEnvVar + ' -e TOTO_EVENTS_GCP_PROJECT_ID=' + eventsGCPProjectEnvVar + ' -e TOTO_HOST=' + totoHostEnvVar + ' -e TOTO_API_AUTH=' + totoApiAuthEnvVar + ' -e GOOGLE_APPLICATION_CREDENTIALS=' + googleApplicationCredentials + logRotation + ' --restart always nicolasances/' + data.microservice + ':latest';

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
