Extending command line arguments and building queries based on those arguments:
```javascript
var MongoClient = require('mongodb').MongoClient,
    commandLineArgs = require('command-line-args'),
    assert = require('assert');


var options = commandLineOptions();


MongoClient.connect('mongodb://localhost:27017/crunchbase', function(err, db) {

    assert.equal(err, null);
    console.log("Successfully connected to MongoDB.");

    var query = queryDocument(options);
    var projection = {"_id": 0, "name": 1, "founded_year": 1,
                      "number_of_employees": 1, "ipo.valuation_amount": 1};

    var cursor = db.collection('companies').find(query, projection);
    var numMatches = 0;

    cursor.forEach(
        function(doc) {
            numMatches = numMatches + 1;
            console.log( doc );
        },
        function(err) {
            assert.equal(err, null);
            console.log("Our query was:" + JSON.stringify(query));
            console.log("Matching documents: " + numMatches);
            return db.close();
        }
    );

});


function queryDocument(options) {

    console.log(options);
```
Once this query is done, we will have an object with one property "founded_year" which has an object with two properties:

##The ways of setting field values in javascript objects

### 1. Explicit convenient syntax, looks similar to constructing JSON objects in the Mongo Shell
```javascript
    var query = {
        "founded_year": {
            "$gte": options.firstYear,
            "$lte": options.lastYear
        }
    };
```
### 2. Dotted syntax on the query object itself accessing a property of that field and assigning a value to that field:

If there is an employees field specified, we'll add another field to the query specifying that we only want to have documents with an employees amount greater than the command line argument given by the user.
```javascript

    if ("employees" in options) {
        query.number_of_employees = { "$gte": options.employees };
    }
```
This extra bit deals with the IPO:

It has a "yes" or "no" field.

1. If user specifies "yes" it means we want to query for documents where the valuation field exists and has an actual value.
2. If "no" is specified we're looking for documents where they haven't had an IPO.
3. If omitted then it will display both.

***Uses Dot Notation 'options.ipo' to specify something about the valuation amount for the IPO embedded document.***

Reaches into the ipo object and drills into the  valuation_amount:

### 3. Access JSON as if it were array, objects are associate arrays, so, I can specify the key I'm interested in in [square brackets] just like an array, but in this case we use a key "ipo.valuation_amount"
```javascript
    if ("ipo" in options) {
        if (options.ipo == "yes") {
            query["ipo.valuation_amount"] = {"$exists": true, "$ne": null};
        } else if (options.ipo == "no") {
            query["ipo.valuation_amount"] = null;
        }               
    }

    return query;

}
```
Added an extra entry for ipo using the -i flag:
```javascript
function commandLineOptions() {

    var cli = commandLineArgs([
        { name: "firstYear", alias: "f", type: Number },
        { name: "lastYear", alias: "l", type: Number },
        { name: "employees", alias: "e", type: Number },
        { name: "ipo", alias: "i", type: String }
    ]);

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
##We use standard techniques used in JS to create and assign value to JS objects
Three primary ways:
1. Convenient, curly braces
2. Referencing the field using a dot, just like you'd reference an object using a dot
3. Array like Syntax
