var exec = require('child_process').exec;

var downloadCode = require('./DownloadMSCode');
var buildDockerImage = require('./DockerImageBuild');
var pushDockerImage = require('./DockerImagePush');
var runDockerImage = require('./DockerImageRun');

var ongoingReleases = new Map();

var statusStarting = 'STARTING';
var statusGitPull = 'GIT_PULL';
var statusDockerBuild = 'DOCKER_BUILD';
var statusDockerPush = 'DOCKER_PUSH';
var statusDockerRun = 'DOCKER_RUN';
var statusDone = 'RELEASED';

exports.do = function(data) {

  console.log(ongoingReleases);

  // Push this release in the list of ongoing releases
  ongoingReleases.set(data.microservice, {
    microservice: data.microservice,
    status: statusStarting
  });

  return new Promise(function(success, failure) {

    ongoingReleases.set(data.microservice, {microservice: data.microservice, status: statusGitPull});

    // 1. Retrieve microservice from GitHub
    downloadCode.do(data).then((data) => {

      ongoingReleases.set(data.microservice, {microservice: data.microservice, status: statusDockerBuild});

      // 2. Build docker image
      return buildDockerImage.do(data, false);

    }).then(() => {

      ongoingReleases.set(data.microservice, {microservice: data.microservice, status: statusDockerPush});

      // 3. Push docker image to dockerhub
      return pushDockerImage.do(data);

    }).then(() => {

      ongoingReleases.set(data.microservice, {microservice: data.microservice, status: statusDockerRun});

      // 4. Run docker image
      return runDockerImage.do(data);

    }).then(() => {

      ongoingReleases.set(data.microservice, {microservice: data.microservice, status: statusDone});

      success({microservice: data.microservice, deployed: true});

    });

  });
}

exports.getStatus = function(microservice) {

  console.log(ongoingReleases);

  return new Promise(function(success, failure) {

    success(ongoingReleases.get(microservice));

  });

}
