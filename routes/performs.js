var express = require('express');
var router = express.Router();

function getCharacters(res, mysql, context, complete) {
  mysql.pool.query("SELECT id, fname AS name FROM characters", function (error, results, fields) {
    if (error) {
      res.write(JSON.stringify(error));
      res.end();
    }
    context.characters = results;
    complete();
  });
}

function getSurges(res, mysql, context, complete) {
  mysql.pool.query("SELECT id, name FROM surges", function (error, results, fields) {
    if (error) {
      res.write(JSON.stringify(error));
      res.end();
    }
    context.surges = results;
    complete();
  });
}

function getPerforms(res, mysql, context, complete) {
  mysql.pool.query("SELECT performs.characterID AS characterID, performs.surgeID AS surgeID, characters.fname AS name, surges.name AS surge FROM performs INNER JOIN characters ON performs.characterID = characters.id INNER JOIN surges ON performs.surgeID = surges.id", function (error, results, fields) {
    if (error) {
      res.write(JSON.stringify(error));
      res.end();
    }
    context.performs = results;
    complete();
  });
}

router.get('/', function (req, res, next) {
  var callbackCount = 0;
  var context = {};
  var mysql = req.app.get('mysql');
  getCharacters(res, mysql, context, complete);
  getSurges(res, mysql, context, complete);
  getPerforms(res, mysql, context, complete);
  function complete() {
    callbackCount++;
    if (callbackCount >= 3) {
      res.render('performs', context);
    }
  }
});

router.get('/delete', function (req, res, next) {
  var mysql = req.app.get('mysql');

  mysql.pool.query("DELETE FROM performs WHERE characterID = ? AND surgeID = ?", [req.query.characterID, req.query.surgeID], function (err, result) {
    if (err) {
      next(err);
      return;
    }
    res.redirect('/performs');
  });
});

module.exports = router;
