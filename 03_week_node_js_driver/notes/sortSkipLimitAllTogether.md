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
                      "number_of_employees": 1};

```
Everything is the same as the sortSkipLimit.md except we've added skip and limit:


1. Both cursor methods, they do not force a call to the db, it's not until we hit forEach() that db is called.

##Order is always the same in MONGO, it's always sort first, skip second and limit last.


```javascript

    var cursor = db.collection('companies').find(query);
    cursor.project(projection);
    cursor.limit(options.limit);
    cursor.skip(options.skip);
    cursor.sort([["founded_year", 1], ["number_of_employees", -1]]);

    var numMatches = 0;

    cursor.forEach(
        function(doc) {
            numMatches = numMatches + 1;
            console.log(doc.name + "\n\tfounded " + doc.founded_year +
                        "\n\t" + doc.number_of_employees + " employees");
        },
        function(err) {
            assert.equal(err, null);
            console.log("Our query was:" + JSON.stringify(query));
            console.log("Documents displayed: " + numMatches);
            return db.close();
        }
    );

});


function queryDocument(options) {

    console.log(options);

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
2. Added two more default values for skipo and limit to the commandLineArgs:

***skip and limit cmd don't have alias, so, must specify full name with -- double dash***
```javascript

function commandLineOptions() {

    var cli = commandLineArgs([
        { name: "firstYear", alias: "f", type: Number },
        { name: "lastYear", alias: "l", type: Number },
        { name: "employees", alias: "e", type: Number },
        { name: "skip", type: Number, defaultValue: 0 },
        { name: "limit", type: Number, defaultValue: 20000 }
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
Very powerful functionality that makes the db work for us, we simply need to know how many to skip to page results.
