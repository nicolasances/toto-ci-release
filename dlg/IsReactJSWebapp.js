var fs = require('fs');

exports.do = function(data) {

    console.log("[" + data.microservice + "] - Checking type of webapp");

    let reactJS = fs.existsSync('/' + data.microservice + '/App.js');

    if (reactJS) {

      console.log("[" + data.microservice + "] - It is a ReactJS Webapp!");

      return true;

    }

    console.log("[" + data.microservice + "] - It is NOT an ReactJS Webapp!");

    return false;

}
