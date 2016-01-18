var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

var url = 'mongodb://localhost:27017/bikes'; //insert database name after /

MongoClient.connect(url, function(err, db) {

    assert.equal(null, err);
    console.log("Successfully connected to server");

    // Find some documents in our collection
    db.collection('road').find({}).toArray(function(err, docs) {

        // Print the documents returned
        docs.forEach(function(doc) {
            console.log(doc.components);//if you don't drill in then entire object will show
        });

        // Close the DB
        db.close();
    });

    // Declare success
    console.log("Whoah, I just mongofied that script by calling find()");
});
