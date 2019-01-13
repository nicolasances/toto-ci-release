var exec = require('child_process').exec;

var downloadCode = require('./DownloadMSCode');
var buildDockerImage = require('./DockerImageBuild');
var pushDockerImage = require('./DockerImagePush');
var runDockerImage = require('./DockerImageRun');
var updateTyk = require('./TykUpdate');

var ongoingReleases = new Map();

var statusStarting = 'STARTING';
var statusGitPull = 'GIT_PULL';
var statusDockerBuild = 'DOCKER_BUILD';
var statusDockerPush = 'DOCKER_PUSH';
var statusDockerRun = 'DOCKER_RUN';
var statusTykUpdate = 'TYK_UPDATE';
var statusDone = 'RELEASED';

exports.do = function(data) {

  // Add the microservice name to data
  data.name = data.microservice.substring('toto-nodems-'.length);

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
      // pushDockerImage.do(data);

      // 4. In parallel, run docker image
      ongoingReleases.set(data.microservice, {microservice: data.microservice, status: statusDockerRun});

      return runDockerImage.do(data);

    }).then(() => {

      ongoingReleases.set(data.microservice, {microservice: data.microservice, status: statusTykUpdate});

      // 5. Check if the API is present on the API Gateway and if not release it
      return updateTyk.do(data);

    }).then((res) => {

      ongoingReleases.set(data.microservice, {microservice: data.microservice, status: statusDone});

      success({microservice: data.microservice, deployed: true, updates: res});

    });

  });
}

exports.getStatus = function(microservice) {

  return new Promise(function(success, failure) {

    let status = ongoingReleases.get(microservice);

    // In case the request arrives before the microservice has even been started, return STARTING status
    if (status == null) success({microservice: microservice, status: statusStarting});
    else success(status);

  });

}
