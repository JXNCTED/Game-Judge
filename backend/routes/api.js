var express = require('express');
var router = express.Router();

const { adminLookUp, scoreLookUp, logLookUp, addLog, scoreUpdate } = require('../database/database-api');

router.get('/get-admin', function(req, res, next) {
  adminLookUp().then(r => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(r));
  })
});

router.get('/get-score', function(req, res, next) {
  scoreLookUp(req.query['gameIndex']).then(r => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(r));
  })
});

router.get('/get-log', function(req, res, next) {
  logLookUp(req.query['gameIndex']).then(r => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(r));
  })
});

router.get('/set-log', function(req, res, next) {
  addLog({
    gameIndex: parseInt(req.query['gameIndex']),
    side: req.query['side'],
    ruleIndex: parseInt(req.query['ruleIndex']),
    score: parseInt(req.query['score']),
    timestamp: Date().toString("'MM'-'dd'T'HH':'mm':'ss")
  }).then(r => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(r));
  })
});

router.get('/cal-score', function(req, res, next) {
  if(req.query['gameIndex'] === undefined) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({acknowledged: false, errorMsg: "game index is needded"}));
    return
  }
  let score = {
    gameIndex: parseInt(req.query['gameIndex']),
    whiteScore: 0,
    blackScore: 0,
    timestamp: Date().toString("'MM'-'dd'T'HH':'mm':'ss")
  }
  logLookUp(req.query['gameIndex']).then(rs => {
    console.log(rs)
    rs.forEach(r => {
      if (r.side === "white") {
        score.whiteScore += r.score
      } else {
        score.blackScore += r.score
      }
    })
  })
  scoreUpdate(score.gameIndex, score).then(r => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(r));
  })
});

module.exports = router;
