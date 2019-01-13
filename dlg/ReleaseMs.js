var exec = require('child_process').exec;

var runDockerImage = require('./DockerImageRun');
var updateTyk = require('./TykUpdate');

exports.do = function(data) {

  return new Promise(function(success, failure) {

    data.name = data.microservice.substring('toto-ms-'.length);

    // For Java microservices, I'm not gonna compile and stuff... just get the dockerhub image..
    // Java microservices are not supported anymore.. too heavy

    // 1. Run docker image
    runDockerImage.do(data).then(() => {

      // 2. Deploy on API Gateway
      return updateTyk.do(data);

    }).then(() => {

      success({microservice: data.microservice, deployed: true});

    });

  });
}
