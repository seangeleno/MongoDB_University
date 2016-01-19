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
###Regex stands for Regular Expressions!
Allows us to use regular expressions to match fields with strings values
Drills into awards.text and checks to see if
/ delimits the operation
^ means start at the beginning of w/e value we're matching against
Match exactly a capital W, lower case o, lower case n
. is wild card character
* makes it match any character any number of times
So, to summarize, it says:
Give me back all documents where the awards.text field begins with the word Won

```javascript

db.movieDetails.find({ "awards.text": { $regex: /^Won.*/ } }).pretty()
```
By adding \s it makes it match exactly Won with a space after to further constrain the data and make it more precise to the current needs - ie: ignore fields that start with Wonder
```javascript

db.movieDetails.find({ "awards.text": { $regex: /^Won\s.*/ } }).pretty()
```
Using projection you can only show the title and awards fields
```javascript
db.movieDetails.find({ "awards.text": { $regex: /^Won.*/ } },
                     { title: 1, "awards": 1, _id: 0}).pretty()
```

##Array Operators

Official Definition: $all matches an array that matches all values specified in the query

Give me back ONLY documents where the under genres listed you find, Comedy && Crime && Drama
Must have all three
```javascript
db.movieDetails.find({ genres: { $all: ["Comedy", "Crime", "Drama"] } }).pretty()
db.movieDetails.find({ genres: { $all: ["Comedy", "Crime"] }}, {_id:0, name: 1, genres:1} ).pretty()
```

$size queries based on the length of an array

This query asks for movies that were filmed in only 1 country
```javascript
db.movieDetails.find({ countries: { $size: 1 } }).pretty()


```

Oficial Definition: Selects documents if element in the array matches all the specific $elemMatch conditions


```javascript

db.movieDetails.find({ boxOffice: {$elemMatch: { country: "UK", revenue: { $gt: 15 } } } })
```

```javascript
db.movieDetails.find({ $elemMatch { country: "USA", revenue: {$lt: 10}}})

boxOffice: [ { "country": "USA", "revenue": 41.3 },
             { "country": "Australia", "revenue": 2.9 },
             { "country": "UK", "revenue": 10.1 },
             { "country": "Germany", "revenue": 4.3 },
             { "country": "France", "revenue": 3.5 } ]

db.movieDetails.find({ boxOffice: { country: "UK", revenue: { $gt: 15 } } })
```
