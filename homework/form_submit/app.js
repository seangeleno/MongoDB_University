var express       = require('express')
,   app           = express()
,   engines       = require('consolidate')
,   bodyParser    = require('body-parser')
,   MongoClient   = require('mongodb').MongoClient
,   assert        = require('assert');

app.engine('html', engines.nunjucks);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: true }));

//Handler for internal server errors
function errorHandler(err, req, res, next){
  console.log(err.message);
  console.log(err.stack);
  res.status(500).render('error_template',{ error: err });
}

MongoClient.connect('mongodb://mongo_admin:<iheartmongo>@ds045694.mongolab.com:45694/cannastore-dev', function(err, db){

  assert.equal(null, err);
  console.log("Successfully connected to Mongolabs.");

  app.get('/', function(req, res, next){
    res.render('add_strain', {});
  });

  app.post('/add_strain', function(req, res, next){
    var name = req.body.name;
    var type = req.body.year;
    var thc_content = req.body.thc_content;
    var description = req.body.description;

    if ((name == '') || (type == '') || thc_content = '' || description = '')) {
      next('Plese provide an entry for all fields.');
    } else {
      db.collection('flowers'.insertOne(
        { 'name': name, 'type': type, 'thc_content':thc_content, 'description':description},
        function (err, r) {
          assert.equal(null, err);
          res.send.("Document inserted with _id: " + r.insertedId);
        }
      );
    }
  });

  app.use(errorHandler);

  var server = app.listen(3000, function(){
    var port = server.address().port;
    console.log('Express server listening on port %s', port);
  });

});
