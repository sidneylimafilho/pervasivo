module.exports = {
  handler: function(options) {

    return function(req, res, next) {

      var ok = options.cipherKey && options.cipherIV && req.headers.auth && req.headers.auth !== 'undefined';

      if (!ok) return next(false);

      /* Decrypt the auth object and validate the authentication */
      var authDecrypted = req.headers.auth.decrypt(options.cipherKey, options.cipherIV);
      req.auth = JSON.parse(authDecrypted);

      /* Save the auth object and send back to client */
      res.setHeader('auth', JSON.stringify(req.auth).encrypt(options.cipherKey, options.cipherIV));

      return next(true);
    };

  }
};
