var express     = require('express')
,   app         = express()
,   engines     = require('consolidate')
,   MongoClient = require('mongodb').MongoClient
,   assert      = require('assert');

app.engine('html', engines.nunjucks); //setting up templates
app.set('view engine', 'html'); // creating necessary app settings so app will render correctly
app.set('views', __dirname + '/views');

MongoClient.connect('mongodb://localhost:27017/cannastore-dev', function(err, db) {

    assert.equal(null, err);
    console.log("Successfully connected to MongoDB.");

    app.get('/', function(req, res){

        db.collection('flowers').find({}).toArray(function(err, docs) {
            res.render('flowers', { 'flowers': docs } );
        });

    });

    app.use(function(req, res){
        res.sendStatus(404);
    });

    var server = app.listen(3000, function() {
        var port = server.address().port;
        console.log('Express server listening on port %s.', port);
    });

});
