```javascript
var MongoClient = require('mongodb').MongoClient,
    commandLineArgs = require('command-line-args'),
    assert = require('assert');


var options = commandLineOptions();


MongoClient.connect('mongodb://localhost:27017/crunchbase', function(err, db) {

    assert.equal(err, null);
    console.log("Successfully connected to MongoDB.");

```
#Skipping, limiting and sorting
##Sort
```javascript
    var query = queryDocument(options);
    var projection = {"_id": 0, "name": 1, "founded_year": 1,
                      "number_of_employees": 1};
```
Skip, limit and sort are cursor method that simply chain on to cursor object just like we did with project.

***1 is ascending order***
***-1 is descending order***
```javascript
    var cursor = db.collection('companies').find(query);
    cursor.project(projection);
    //cursor.sort({founded_year: -1});
```
When sorting on multiple fields we use an array because order of sorts is applied is important.

If you pass an object instead of an array, ***there is no guarantee that it will remain in that order***

```javascript
    cursor.sort([["founded_year", 1], ["number_of_employees", -1]]);


    var numMatches = 0;
```
It's not until the cursor hits the forEach() function that it says: "Ooop, looks like I need to go the database to fetch some documents"

Prior to that it is building up the representation of the query in the cursor object as we make additional cursor method calls adding additional detail to the command that we eventually want to issue to the db.
```javascript
    cursor.forEach(
        function(doc) {
            numMatches = numMatches + 1;
            console.log(doc.name + "\n\tfounded " + doc.founded_year +
                        "\n\t" + doc.number_of_employees + " employees");
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

    var query = {
        "founded_year": {
            "$gte": options.firstYear,
            "$lte": options.lastYear
        }
    };

    if ("employees" in options) {
        query.number_of_employees = { "$gte": options.employees };
    }

    return query;

}
```
Basic command line arguments:
```javascript

function commandLineOptions() {

    var cli = commandLineArgs([
        { name: "firstYear", alias: "f", type: Number },
        { name: "lastYear", alias: "l", type: Number },
        { name: "employees", alias: "e", type: Number }
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
