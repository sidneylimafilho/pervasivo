/**
 * Lazy-load modules with getters.
 */

require("fs").readdirSync(__dirname).forEach(function(filename) {

  if (!/\./g.test(filename)) {

    //console.log(filename);
    exports[filename] = require('./' + filename);
  }


  /*
  Object.defineProperty(exports, filename, {
    get: function() {
      return require('./' + filename);
    }
  });
  */

});
