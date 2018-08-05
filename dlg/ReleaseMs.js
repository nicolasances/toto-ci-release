var exec = require('child_process').exec;

var downloadCode = require('./DownloadMSCode');
var buildDockerImage = require('./DockerImageBuild');
var pushDockerImage = require('./DockerImagePush');
var runDockerImage = require('./DockerImageRun');

exports.do = function(data) {

  return new Promise(function(success, failure) {

    // For Java microservices, I'm not gonna compile and stuff... just get the dockerhub image..
    // Java microservices are not supported anymore.. too heavy

    // 1. Run docker image
    runDockerImage.do(data).then(() => {

      success({microservice: data.microservice, deployed: true});

    });

  });
}
