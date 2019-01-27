var express = require('express');
var router = express.Router();

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

function getSurges (res, mysql, context, complete) {
  mysql.pool.query("SELECT id, name FROM surges", function (error, results, fields) {
    if (error) {
      res.write(JSON.stringify(error));
      res.end();
    }
    context.surge = results;
    complete();
  });
}

function getAssociations(res, mysql, context, complete) {
  mysql.pool.query("SELECT knights_radiant.name AS name, surges.name AS surge FROM associated_with INNER JOIN knights_radiant ON associated_with.orderID = knights_radiant.id INNER JOIN surges ON associated_with.surgeID = surges.id", function(error, results, fields) {
    if (error) {
      res.write(JSON.stringify(error));
      res.end();
    }
    context.associated_with = results;
    complete();
  });
}

/* Dispay all associations. */
router.get('/', function (req, res, next) {
  var callbackCount = 0;
  var context = {};
  var mysql = req.app.get('mysql');
  getOrders(res, mysql, context, complete);
  getSurges(res, mysql, context, complete);
  getAssociations(res, mysql, context, complete);
  function complete() {
    callbackCount++;
    if (callbackCount >= 3) {
      res.render('associated_with', context);
    }
  }
});

/* Add new association */
router.get('/associated_with/insert', function (req, res, next) {
  var context = {};
  var mysql = req.app.get('mysql');

  mysql.pool.query("INSERT INTO associated_with (orderID, surgeID)  VALUES(?, ?)", [req.query.orderfk, req.query.surgefk], function (err, result) {
    if (err) {
      next(err);
      return;
    }
    context.results = "Inserted id " + result.insertId;
    res.redirect('/associated_with');
  });
});

module.exports = router;
