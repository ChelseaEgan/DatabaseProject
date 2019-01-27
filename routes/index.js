var express = require('express');
var router = express.Router();

function getSpren(res, mysql, context, complete) {
  mysql.pool.query("SELECT id, name FROM spren", function (error, results, fields) {
    if (error) {
      res.write(JSON.stringify(error));
      res.end();
    }
    context.spren = results;
    complete();
  });
}

function getOrders(res, mysql, context, complete) {
  mysql.pool.query("SELECT id, name FROM knights_radiant", function (error, results, fields) {
    if (error) {
      res.write(JSON.stringify(error));
      res.end();
    }
    context.order = results;
    complete();
  });
}

function getCharacters(res, mysql, context, complete) {
  mysql.pool.query("SELECT characters.id, fname, lname, gender, nationality, eyecolor, spren.name AS spren, knights_radiant.name AS knights_radiant FROM characters LEFT JOIN spren ON characters.sprenfk = spren.id LEFT JOIN knights_radiant ON characters.orderfk = knights_radiant.id", function (error, results, fields) {
    if (error) {
      res.write(JSON.stringify(error));
      res.end();
    }
    context.characters = results;
    complete();
  });
}

/* Display all characters. */
router.get('/', function (req, res, next) {
  var callbackCount = 0;
  var context = {};
  var mysql = req.app.get('mysql');
  getSpren(res, mysql, context, complete);
  getOrders(res, mysql, context, complete);
  getCharacters(res, mysql, context, complete);
  function complete() {
    callbackCount++;
    if (callbackCount >= 3) {
      res.render('index', context);
    }
  }
});

/* Add new character */
router.get('/insert', function (req, res, next) {
  var context = {};
  var mysql = req.app.get('mysql');

  mysql.pool.query("INSERT INTO characters (fname, lname, gender, nationality, eyecolor, sprenfk, orderfk)  VALUES(?, ?, ?, ?, ?, ?, ?)", [req.query.fname, req.query.lname, req.query.gender, req.query.nationality, req.query.eyecolor, req.query.sprenfk, req.query.orderfk], function (err, result) {
    if (err) {
      next(err);
      return;
    }
    context.results = "Inserted id " + result.insertId;
    res.redirect('/');
  });
});

module.exports = router;
