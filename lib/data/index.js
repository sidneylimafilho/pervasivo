/*jshint node:true, boss:true */
"use strict";

//var connString = process.env.connString = JSON.parse(process.env.connString);


function executeQuery(sql, params, callback) {

  callback(sql);
}

module.exports = {
  handler: function sqlHandler(options) {

    return function(req, res) {

      if (!sqlHandler[req.url]) {
        if (!/\.sql$/g.test(req.url)) return res.status(404).end();

        var filepath = require("path").resolve(__dirname, "../../.." + req.url);
        if (!require("fs").existsSync(filepath))
          return res.status(404).end();

        sqlHandler[req.url] = require("fs").readFileSync(filepath, {
          encoding: 'utf8'
        });
      }

      executeQuery(sqlHandler[req.url], req.params, function(data) {
        res.end(data);
      });

    };
  }
};
