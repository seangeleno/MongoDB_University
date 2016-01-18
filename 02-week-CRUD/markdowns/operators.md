#MongoDB University Notes

##Comparison Operators
$gt is greater than, in this example we use it to find movies that were longer than 90 minutes
```javascript
db.movieDetails.find({ runtime: { $gt: 90 } }).count()
```
Combining $gt and $lt you can constrain the data within designated parameters
```javascript
db.movieDetails.find({ runtime: { $gt: 90, $lt: 120 } }).count()
```
Multiple parameters can be passed, in this example, has high rating of tomato.meter
greater than or equal to $gte 95 as well as being longer than 180 minutes.
```javascript
db.movieDetails.find({ "tomato.meter": { $gte: 95 }, runtime: { $gt: 180 } })
```
matches all values that are not equal to - $ne is NOT EQUAL
it can be used for data cleaning, excludes certain types of data, ie: only looking for rated movies
```javascript
db.movieDetails.find({ rated: { $ne: "UNRATED" } }).count()
```
$in returns all values that are within an ARRAY, you can add more values to further contrain data
```javascript
db.movieDetails.find({ rated: { $in: ["G", "PG"] } }).pretty()

```

##Element Operators
###Considerations of the Shape of a Document

It is possible, but a bad idea, to have the same field in a collection,
have a different type of value from one document to another

Some movies might pre-date tomato.meter or a rating of any kind.

This query finds documents that have a tomato.meter field within
```javascript
db.movieDetails.find({ "tomato.meter": { $exists: true } })
```
This will return movies that don't have a tomato.meter
```javascript
db.movieDetails.find({ "tomato.meter": { $exists: false } })
```

This references the movie Scratch that has 4 copies of Star Trek with the _ id field as the IMDB number
by querying the type as a string you can find particular types of data
```javascript
db.moviesScratch.find({ _id: { $type: "string" } })
```

##Logical Operators
By using $or we can give multiple parameters, in this case we can assume that because
tomato.meter is written by general public and metacritic is written by professionals,
the pros will go harder, so you can adjust the search criteria for a lower number
on metacritic while higher on tomato.meter to give new data

```javascript
db.movieDetails.find({ $or : [ { "tomato.meter": { $gt: 99 } },
                               { "metacritic": { $gt: 95 } } ] })
```

```javascript
db.movieDetails.find({ $and : [ { "metacritic": { $ne: 100 } },
                                { "metacritic" { $exists: true } } ] })
```

##Regex Operators

##Array Operators
