#find() and Cursors in the Node.js Driver

```javascript
mongoimport -d crunchbase -c companies companies.json
```
allows us to import json files into a specific database and collection

```javascript

var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

```
If you want to connect to something other than local host change 27017 to what you're using.

If you want to use another port do the

mongod --port <port number>

database goes after port number
```javascript
MongoClient.connect('mongodb://localhost:27017/crunchbase', function(err, db) {

    assert.equal(err, null);
    console.log("Successfully connected to MongoDB.");
```
Construct a query object and pass the object to find(query)

This way you can separate the what you want to search for from the search process itself

Whoah....mind....blown....

This is saying: Give me all documents where the "category_code" field is equal to the string "biotech"
```javascript
    var query = {"category_code": "biotech"};
```

```javascript

    db.collection('companies').find(query).toArray(function(err, docs) {

        assert.equal(err, null);
        assert.notEqual(docs.length, 0);

        docs.forEach(function(doc) {
            console.log( doc.name + " is a " + doc.category_code + " company." );
        });

        db.close();

    });

});

```

##Explicit Cursors


This example is similar to the one above, except it:

1. Call to find method, but no callback
2. Removed toArray which consumes cursor, instead of storing all the data to memory we're ***streaming the data live***
3. Becomes synchronous as it waits for a return value rather than continuing the execution of this app in the main thread of execution while the call to find is completed in a separate thread of execution.

Point of cursor is to describe query.

```javascript
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');


MongoClient.connect('mongodb://localhost:27017/crunchbase', function(err, db) {

    assert.equal(err, null);
    console.log("Successfully connected to MongoDB.");

    var query = {"category_code": "biotech"};

    var cursor = db.collection('companies').find(query);

    cursor.forEach(
        function(doc) {
            console.log( doc.name + " is a " + doc.category_code + " company." );
        },
        function(err) {
            assert.equal(err, null);
            return db.close();
        }
    );

});

```
In the end, both have the same result for this example but by using a cursor var with forEach it streams the data as it is needed.
