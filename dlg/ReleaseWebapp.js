var exec = require('child_process').exec;

var downloadCode = require('./DownloadMSCode');
var createConfig = require('./WriteWebConfig');
var createTotoConfig = require('./WriteTotoConfig');
var createAngular2Config = require('./WriteAngular2Config');
var createReactJSConfig = require('./WriteReactJSConfig');
var buildDockerImage = require('./DockerImageBuild');
var pushDockerImage = require('./DockerImagePush');
var runDockerImage = require('./DockerImageRun');
var isAngular2Webapp = require('./IsAngular2Webapp');
var isReactJSWebapp = require('./IsReactJSWebapp');

var ongoingWebappReleases = new Map();

exports.do = function(data) {

  var statusStarting = 'STARTING';
  var statusGitPull = 'GIT_PULL';
  var statusConfig = 'CONFIG';
  var statusDockerBuild = 'DOCKER_BUILD';
  var statusDockerPush = 'DOCKER_PUSH';
  var statusDockerRun = 'DOCKER_RUN';
  var statusDone = 'RELEASED';

  return new Promise(function(success, failure) {

    ongoingWebappReleases.set(data.microservice, {
      microservice: data.microservice,
      status: statusStarting
    });

    ongoingWebappReleases.set(data.microservice, {microservice: data.microservice, status: statusGitPull});

    // 1. Retrieve microservice from GitHub
    downloadCode.do(data).then((data) => {

      ongoingWebappReleases.set(data.microservice, {microservice: data.microservice, status: statusConfig});

      // 2. Create the configuration file
      // If it's the old toto webapp, create the old configuration file
      if (data.microservice == 'toto') return createTotoConfig.do(data);
      // If it's an Angular2+ app
      else if (isAngular2Webapp.do(data)) return createAngular2Config.do(data);
      // If it's a ReactJS app
      else if (isReactJSWebapp.do(data)) return createReactJSConfig.do(data);
      // Otherwise it's an AngularJS app
      else return createConfig.do(data);

    }).then(() => {

      ongoingWebappReleases.set(data.microservice, {microservice: data.microservice, status: statusDockerBuild});

      // 3. Build docker image
      return buildDockerImage.do(data, data.microservice == 'toto' ? true : false);

    }).then(() => {

      ongoingWebappReleases.set(data.microservice, {microservice: data.microservice, status: statusDockerRun});

      // 5. Run docker image
      return runDockerImage.do(data);

    }).then(() => {

      ongoingWebappReleases.set(data.microservice, {microservice: data.microservice, status: statusDone});

      success({microservice: data.microservice, deployed: true});

    });

  });
}

exports.getStatus = function(microservice) {

  return new Promise(function(success, failure) {

    success(ongoingWebappReleases.get(microservice));

  });

}
