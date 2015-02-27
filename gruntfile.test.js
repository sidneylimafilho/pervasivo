module.exports = function(grunt, config) {

  grunt.loadNpmTasks("grunt-contrib-jshint");
  config.jshint = {
    files: ["*.js", "lib/**/*.js", "tests/**/*.js"],
    options: {
      /* ignores third-party node_modules neither libs 
      ignores: ["** /node_modules/** /*.js", "** /themes/** /*.js"],*/
      globals: {
        jQuery: true,
        console: true,
        module: true
      },
      multistr: true
    }
  };

  grunt.loadNpmTasks("grunt-contrib-clean");
  config.clean = {
    coverage: {
      force: true,
      src: ["coverage/"]
    }
  };

  grunt.loadNpmTasks("grunt-contrib-copy");
  config.copy = {
    coverage: {
      src: ["tests/**"],
      dest: "coverage/"
    }
  };

  grunt.loadNpmTasks("grunt-blanket");
  config.blanket = {
    coverage: {
      files: {
        'coverage/lib/': ['lib/']
      }
    }
  };

  // Add the grunt-mocha-test tasks.
  grunt.loadNpmTasks("grunt-mocha-test");
  config.mochaTest = {
    test: {
      options: {
        reporter: 'html-cov',
        // use the quiet flag to suppress the mocha console output
        quiet: true,
        // specify a destination file to capture the mocha
        // output (the quiet option does not suppress this)
        captureFile: 'coverage.html'
      },
      src: ["coverage/tests/**/*.js"]
    },
    coverage: {
      options: {
        reporter: 'travis-cov',
        threshold: 100 // The value needs be configured in package.json 
      },
      src: ["coverage/lib/**/*.js"]
    }
  };

  grunt.registerTask("test", ["clean", "jshint", "copy", "blanket", "mochaTest", "clean"]);

};
