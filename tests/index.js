var should = require('should');
var pervasivo = require('../lib/');

describe('Pervasivo', function() {

  // within before() you can run all the operations that are needed to setup your tests. In this case
  // I want to create a connection with the database, and when I'm done, I call done().
  before(function(done) {
    done();
  });

  describe('CRYPTO', function() {

    it('should extend the global String object with encrypt method', function(done) {
      String.prototype.encrypt.should.have.type('function', 'encrypt method missing');
      done();
    });

    it('String teste should be aPWIA3Cx6cQ= ', function(done) {
      pervasivo.crypto.encrypt('teste').should.be.exactly('aPWIA3Cx6cQ=', 'encrypt teste fail');
      done();
    });

  });

  describe('AUTH', function() {

    it('Auth should have a handler method', function(done) {
      pervasivo.auth.handler.should.have.type('function', 'the handler method not exists');
      done();
    });

    it('The handler method receives options as parameter and return a function', function(done) {
      pervasivo.auth.handler().should.have.type('function', 'The handler not returns a function');
      done();
    });

    it('When have not a cipher key then should have abort', function(done) {
      var options = {},
        req = {},
        res = {},
        next = function(result) {
          return result;
        };
      var result = pervasivo.auth.handler(options)(req, res, next);
      result.should.be.exactly(false, 'The handler can not be executed without cipherkey');
      done();
    });

    it('When have a cipher key then should decrypt request.header.auth and set request.auth', function(done) {
      var options = {
          cipherKey: 'Framework\\Security\\Crypt',
          cipherIV: 'perto.vc'
        },
        req = {
          headers: {
            auth: 'wJ6fZJyUb6W4I2QrKimnMg=='
          }
        },
        finalValue = '',
        res = {
          setHeader: function(header, value) {
            finalValue = value;
          }
        },
        next = function(result) {
          return result;
        };
      var result = pervasivo.auth.handler(options)(req, res, next);
      result.should.be.exactly(true, 'The handler was not executed');
      req.auth.userid.should.be.exactly(1, 'The request auth should be a object deserialized');
      finalValue.should.be.exactly('wJ6fZJyUb6W4I2QrKimnMg==', 'The setHeader should be updated with new string encrypted');
      done();
    });

  });

  describe('DATA', function() {

    it('Data should have a handler method', function(done) {
      pervasivo.data.handler.should.have.type('function', 'the handler method not exists');
      done();
    });

    it('The handler method receives options as parameter and return a function', function(done) {
      pervasivo.data.handler().should.have.type('function', 'The handler not returns a delegate');
      done();
    });

    it('When data handler have an url already processed \
        then should execute query and send data to res.end', function(done) {

      pervasivo.data.handler.$$teste$$ = 'select 1';
      var options = {},
        req = {
          url: '$$teste$$'
        },
        res = {
          status: function(code) {
            return {
              end: function() {
                return code;
              }
            };
          }
        };

      var result = pervasivo.data.handler(options)(req, res);
      result.should.be.exactly(200, 'The handler did not call executeQuery');

      done();
    });

    it('When data handler receive a new url not terminated With .SQL \
        then should set status 415 and it abort execution', function(done) {

      delete pervasivo.data.handler.$$teste$$;
      var options = {},
        req = {
          url: '$$teste$$'
        },
        res = {
          status: function(code) {
            return {
              end: function() {
                return code;
              }
            };
          }
        };

      var result = pervasivo.data.handler(options)(req, res);
      result.should.be.exactly(415, 'Non .SQL files should return 415 status code');

      done();
    });

    it('When data handler receive a new url terminated With .SQL but the file not exists in server\
        then should set status 404 and it abort execution', function(done) {

      delete pervasivo.data.handler['teste.sql'];
      var options = {},
        req = {
          url: 'teste.sql'
        },
        res = {
          status: function(code) {
            return {
              end: function() {
                return code;
              }
            };
          }
        },
        path = {
          resolve: function(argument) {
            return req.url;
          }
        },
        fs = {
          existsSync: function() {
            return false;
          }
        };

      var result = pervasivo.data.handler(options)(req, res, path, fs);
      result.should.be.exactly(404, 'Non .SQL files should return 404 status code');

      done();
    });

    it('When data handler receive a new url terminated With .SQL and the file exists in server\
        then should read the file, execute your contents, set status 200 and return data', function(done) {

      delete pervasivo.data.handler['teste.sql'];
      var options = {},
        req = {
          url: 'teste.sql'
        },
        res = {
          status: function(code) {
            return {
              end: function() {
                return code;
              }
            };
          }
        },
        path = {
          resolve: function(argument) {
            return req.url;
          }
        },
        fs = {
          existsSync: function() {
            return true;
          },
          readFileSync: function() {
            return 'select 1';
          }
        };

      var result = pervasivo.data.handler(options)(req, res, path, fs);
      result.should.be.exactly(200, '.SQL files should execute and return data');

      done();
    });
  });
});
