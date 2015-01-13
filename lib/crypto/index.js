module.exports = {
  encrypt: function(token, key, IV) {

    key = key || "Framework\\Security\\Crypt";
    IV = IV || "perto.vc";

    var cipher = require('crypto').createCipheriv('des-ede3-cbc', key, IV);
    var newToken = cipher.update(token, 'utf8', 'base64');
    newToken += cipher.final('base64');

    return newToken;
  },
  decrypt: function(token, key, IV) {

    key = key || "Framework\\Security\\Crypt";
    IV = IV || "perto.vc";

    var decipher = require('crypto').createDecipheriv('des-ede3-cbc', key, IV);
    var newToken = decipher.update(token, 'base64', 'utf8');
    newToken += decipher.final('utf8');

    return newToken;
  }
};

String.prototype.encrypt = function(key, IV) {
  return module.exports.encrypt(this.toString(), key, IV);
};

String.prototype.decrypt = function(key, IV) {
  return module.exports.decrypt(this.toString(), key, IV);
};
