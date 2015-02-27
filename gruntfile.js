var pervasivo = require("pervasivo");

module.exports = function(grunt) {

  var config = {
    pkg: grunt.file.readJSON("package.json")
  };

  require("./gruntfile.test.js")(grunt, config);

  // Project configuration.
  grunt.initConfig(config);
  
  grunt.registerTask("default", ["test"]);

};
