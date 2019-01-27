var express = require('express');
var router = express.Router();

var speciesArray = [
  'Ashspren',
  'Cryptic',
  'Cultivationspren',
  'Highspren',
  'Inkspren',
  'Honorspren',
  'Lightspren',
  'Other/Unkown'
];

function getSpren(res, mysql, context, complete) {
  mysql.pool.query("SELECT id, name, species, bonded FROM spren", function (error, results, fields) {
    if (error) {
      res.write(JSON.stringify(error));
      res.end();
    }
    context.spren = results;
    complete();
  });
}

/* GET users listing. */
router.get('/', function (req, res, next) {
  var callbackCount = 0;
  var context = {};
  var mysql = req.app.get('mysql');
  getSpren(res, mysql, context, complete);
  function complete() {
    callbackCount++;
    if (callbackCount >= 1) {
      res.render('spren', context);
    }
  }
});

module.exports = router;
