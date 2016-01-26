More programatic access to MongoDB.

Simple application that takes command line parameters and queries mongodb.
command-line-args gives us a nice way to deal with command line arguments passed.
```javascript
var MongoClient = require('mongodb').MongoClient,
    commandLineArgs = require('command-line-args'),
    assert = require('assert');


var options = commandLineOptions();

MongoClient.connect('mongodb://localhost:27017/crunchbase', function(err, db) {

    assert.equal(err, null);
    console.log("Successfully connected to MongoDB.");
```

The query variable calls the queryDocument function with the options passed as an argument.

```javascript
    var query = queryDocument(options);
```
Here we specify the projection:
```javascript
    var projection = {"_id": 1, "name": 1, "founded_year": 1,
                      "number_of_employees": 1, "crunchbase_url": 1};
```

Both query and projection are passed as arguments in the find() function:

```javascript
    var cursor = db.collection('companies').find(query, projection);
    var numMatches = 0;
```
Then  you call forEach on the cursor along with two functions:

1. Iterates through the documents and keeps a count.
2. called if error or if cursor has been exhausted
```javascript
    cursor.forEach(
        function(doc) {
            numMatches = numMatches + 1;
            console.log( doc );
        },
```
JSON.stringify is a convenient method that allows us to pass an object that will generate an string representation of the object.
```javascript
        function(err) {
            assert.equal(err, null);
            console.log("Our query was:" + JSON.stringify(query));
            console.log("Matching documents: " + numMatches);
            return db.close();
        }
    );

});
```
The queryDocument has the options parameter passed in:
```javascript

function queryDocument(options) {

    console.log(options);
```
query object is constructed with the key $gte and $lte and this creates a range:
```javascript
    var query = {
        "founded_year": {
            "$gte": options.firstYear,
            "$lte": options.lastYear
        }
    };
```
Final piece deals with employees passed in the options parameter:
We check to see if the employees key is in fact in the options parameter.

The "in" operator is the syntax we use for checking a key in an object in Javascript:

number_of_employees gets built in to the query operator
```javascript

    if ("employees" in options) {
        query.number_of_employees = { "$gte": options.employees };
    }

    return query;

}
```
commandLineOptions() specifies the arguments that will be passed:
Stipulating that they will be numbers.
commandLineArgs gives us an object that we can use.
```javascript

function commandLineOptions() {

    var cli = commandLineArgs([
        { name: "firstYear", alias: "f", type: Number },
        { name: "lastYear", alias: "l", type: Number },
        { name: "employees", alias: "e", type: Number }
    ]);
```
So, to use it you would input the following in the command line:

node app.js -f year -l year -e min_number_of_employees

the results of parse is passed to the options variable:

So, for first year, last year and employees even though we're just using the alias in the command,
we're referencing them with the fullname in this options var.

This options command requires first and last year to be filled in but the employee number is optional

Only returns if this condition does not hold and we don't get an error message.

```javascript

    var options = cli.parse()
    if ( !(("firstYear" in options) && ("lastYear" in options))) {
        console.log(cli.getUsage({
            title: "Usage",
            description: "The first two options below are required. The rest are optional."
        }));
        process.exit();
    }

    return options;

}
```
