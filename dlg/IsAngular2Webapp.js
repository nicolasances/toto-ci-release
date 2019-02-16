var fs = require('fs');

exports.do = function(data) {

    console.log("[" + data.microservice + "] - Checking type of webapp");

    let angular2 = fs.existsSync('/' + data.microservice + '/angular.json');

    if (angular2) {

      console.log("[" + data.microservice + "] - It is an Angular 2+ Webapp!");

      return true;

    }

    console.log("[" + data.microservice + "] - It is NOT an Angular 2+ Webapp!");

    return false;

}
