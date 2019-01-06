var exec = require('child_process').exec;

// Builds the docker image
exports.do = function(conf) {

  return new Promise(function(success, failure) {

    // Build docker image command
    var nginxBuild = '';

    nginxBuild += 'cd /nginx-setup; ';
    nginxBuild += 'docker build -t toto-nginx . ;';

    console.log('[' + conf.microservice + '] NGINX : Building docker image...');

    // Build docker image
    exec(nginxBuild, function(err, stdout, stderr) {

      if (err) {
        failure(err);
        return;
      }

      console.log('[' + conf.microservice + '] NGINX : Docker image built!');

      success();

    });

  });

}
