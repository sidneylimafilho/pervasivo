/**
 * Lazy-load modules with getters.
 */

require("fs").readdirSync(__dirname).forEach(function(filename) {

  if (!/\.js/.test(filename))
    exports[filename] = require('./' + filename);

  /*
  Object.defineProperty(exports, filename, {
    get: function() {
      return require('./' + filename);
    }
  });
  */

});
