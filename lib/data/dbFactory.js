module.exports = function DbFactory(provider) {
  var adapter = require("./" + provider + "Adapter");

};
