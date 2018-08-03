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
    downloadCode.do(data.microservice).then(() => {

      console.log(data);

      // 2. Create the configuration file
      return createConfig.do(data);

    }).then(() => {

      // 3. Build docker image
      return buildDockerImage.do(data);

    }).then(() => {

      // 4. Push docker image to dockerhub
      return pushDockerImage.do(data);

    }).then(() => {

      // 5. Run docker image
      return runDockerImage.do(data);

    }).then(() => {

      success({microservice: data.microservice, deployed: true});

    });

  });
}
