var express = require('express');
var router = express.Router();

function getOrders(res, mysql, context, complete) {
  mysql.pool.query("SELECT id, name, herald, spren_type FROM knights_radiant", function (error, results, fields) {
    if (error) {
      res.write(JSON.stringify(error));
      res.end();
    }
    context.kr = results;
    complete();
  });
}

router.get('/', function (req, res, next) {
  var callbackCount = 0;
  var context = {};
  var mysql = req.app.get('mysql');
  getOrders(res, mysql, context, complete);
  function complete() {
    callbackCount++;
    if (callbackCount >= 1) {
      res.render('knightsradiant', context);
    }
  }
});

module.exports = router;
