var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Database = require('../lib/database');

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date());
    next();
})

router.get('/list', urlencodedParser, function(req, res, next) {
    console.log('[GET /highscores/list]');
    Database.getDb(req.app, function(err, db) {
        if (err) {
            return next(err);
        }

        // Retrieve the top 10 high scores
        var col = db.db("pacman").collection('highscores');
        col.find({}).sort([['score', -1]]).limit(10).toArray(function(err, docs) {
            var result = [];
            if (err) {
                console.log(err);
            }

            docs.forEach(function(item, index, array) {
                result.push({ name: item['name'], cloud: item['cloud'],
                              zone: item['zone'], host: item['host'],
                              score: item['score'] });
            });

            res.json(result);
        });
    });
});

// Accessed at /highscores
router.post('/', urlencodedParser, function(req, res, next) {
    console.log('[POST /highscores] body =', req.body,
                ' host =', req.headers.host,
                ' user-agent =', req.headers['user-agent'],
                ' referer =', req.headers.referer);

    var userScore = parseInt(req.body.score, 10),
        userLevel = parseInt(req.body.level, 10);

    console.log('highscore 1001');
    
    Database.getDb(req.app, function(err, db) {
        if (err) {
            return next(err);
        }
        
        console.log('highscore 1002');
        
        // Insert high score with extra user data
        var insert_score = "INSERT INTO highscores (name, cloud, zone, host, score, level, date, referer, user_agent, hostname, ip_addr) VALUES ('" + req.body.name + "', '" + req.body.cloud + "', '" + req.body.zone + "', '" + req.body.host +  "', " + userScore + ", " + userLevel + ", " + Date() + ", '" + req.header.referer + "', '" + req.headers['user-agent'] + "', '" + req.hostname + "', '" + req.ip + "')";
        console.log('INSERT QUERY: ' + insert_score);
        db.query(insert_score, function(err, rows){
            if(err){
                console.error(err);
                return;
            }else{
                console.log(rows);
                return;
            }
        });

        console.log('highscore 1003');
    });
});

module.exports = router;
