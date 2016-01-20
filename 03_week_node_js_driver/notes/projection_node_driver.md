##toArray vs forEach

toArray wait to execute callback until all documents have been retrieved in the array.

forEach can process batches of documents as they come in

The driver provides one set of classes and methods we use to interact with mongodb and the
mongo shell provides its own API.

With respect to CRUD as of mongo 3.2 the shell and the drivers adhereto the same CRUD spec,
they support the same set of CRUD methods, including findOne(), insertOne(), insertMany()

How you access and implement these varies from the shell to the node.js driver and from the node.js driver to drivers for other programming languages.

We see one main difference in how we express projection, the current best practice is to chain a call to project onto our cursor, this call to project sets a field projection for the query, this call does not force a request to retrieve documents from the db as the forEach() method, rather it adds additional detail to the query representation maintained by our cursor.

There are a number of cursor methods that we can chain together to fully express the query we want against our Mongodb.

```javascript
var MongoClient = require('mongodb').MongoClient
,   assert      = require('assert');


MongoClient.connect('mongodb://localhost:27017/crunchbase', function(err, db) {

    assert.equal(err, null);
    console.log("Successfully connected to MongoDB.");
```

We create a document for our query and a document for our projection:
```javascript

    var query = {"category_code": "biotech"};
    var projection = {"name": 1, "category_code": 1, "_id": 0};
```

Then we have the call to find() - it's a SYNCHRONOUS call, won't actually go and fetch documents from the database, rather it will immediately return a cursor to us, which we will modify with a field projection, using the project method on cursors, then we will call the forEach() on this cursor passing it

callback for iteration through the returned documents and this callback as the second paramater for forEach()
```javascript


    var cursor = db.collection('companies').find(query);
    cursor.project(projection);

    ```
first callback for iteration through the returned documents:
    ```javascript
    cursor.forEach(
        function(doc) {
            console.log(doc.name + " is a " + doc.category_code + " company.");
            console.log(doc);
        },
```
and this callback as the second parameter for forEach():
```javascript        
        function(err) {
            assert.equal(err, null);
            return db.close();
        }
    );

});

```
They run as a set of parameters to run once we've exhausted the cursor, OR
if we encounter an error

##Performance Advantage

only using bandwith for data we need, this can speed things up if there are thousands of clients making requests simultaneously. By projecting out only the fields that we need, we save bandwith and performance time.
