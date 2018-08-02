var exec = require('child_process').exec;

var downloadCode = require('./DownloadMSCode');
var createConfig = require('./WriteTotoConfig');
var buildDockerImage = require('./DockerImageBuild');
var pushDockerImage = require('./DockerImagePush');
var runDockerImage = require('./DockerImageRun');

exports.do = function(data) {

  return new Promise(function(success, failure) {

    console.log("Starting release of Toto Webapp...");
    console.log("Payload: " + JSON.stringify(data));

    // 1. Retrieve microservice from GitHub
    downloadCode.do(data.microservice).then(function() {

      // 2. Create the configuration file
      createConfig.do(data).then(function() {

        // 3. Build docker image
        buildDockerImage.do(data).then(function() {

          // 4. Push docker image to dockerhub
          pushDockerImage.do(data).then(function() {

            // 5. Run docker image
            runDockerImage.do(data).then(function() {

              success({microservice: data.microservice, deployed: true});

            }, failure);

          }, failure);

        }, failure);

      }, failure);

    }, failure);

  });
}
