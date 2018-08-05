var exec = require('child_process').exec;

var downloadCode = require('./DownloadMSCode');
var buildDockerImage = require('./DockerImageBuild');
var pushDockerImage = require('./DockerImagePush');
var runDockerImage = require('./DockerImageRun');

exports.do = function(data) {

  return new Promise(function(success, failure) {

    console.log("Starting release of Toto Webapp...");

    // 1. Retrieve microservice from GitHub
    downloadCode.do(data).then((data) => {

      // 2. Build docker image
      return buildDockerImage.do(data, true);

    }).then(() => {

      // 3. Push docker image to dockerhub
      return pushDockerImage.do(data);

    }).then(() => {

      // 4. Run docker image
      return runDockerImage.do(data);

    }).then(() => {

      success({microservice: data.microservice, deployed: true});

    });

  });
}
