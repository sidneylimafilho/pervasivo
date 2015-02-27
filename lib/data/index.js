/*jshint node:true, boss:true */
"use strict";

//var connString = process.env.connString = JSON.parse(process.env.connString);


function executeQuery(sql, params, callback) {
  return callback(sql);
}

module.exports = {
  dbFactory: require('./dbFactory.js'),
  handler: function sqlHandler(options) {

    return function(req, res, path, fs) {

      if (!sqlHandler[req.url]) {

        // 415 Unsupported Media Type
        if (!/\.sql$/g.test(req.url))
          return res.status(415).end();

        path = path || require("path");
        fs = fs || require("fs");

        var filepath = path.resolve(__dirname, "../../.." + req.url);

        // 404 Not Found
        if (!fs.existsSync(filepath))
          return res.status(404).end();

        sqlHandler[req.url] = fs.readFileSync(filepath, {
          encoding: 'utf8'
        });
      }

      return executeQuery(sqlHandler[req.url], req.params, function(data) {
        return res.status(200).end(data);
      });
    };
  }
};
