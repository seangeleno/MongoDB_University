## Create

## Read

# Update - Time to update documents.

## Delete
UpdateOne and UpdateMany

![Update Operators]("Update_Operators_Mongo.jpg")


updateOne updates the first document matchign the selector

This is an example of adding a movie poster field to "The Martian" because it didn't have one before
If it had one, it would modify

Must use update operator - $set in this case
```Javascript

db.movieDetails.updateOne({title: "The Martian"},
                          { $set: {poster: "http://ia.media-imdb.com/images/M/MV5BMTc2MTQ3MDA1Nl5BMl5BanBnXkFtZTgwODA3OTI4NjE@._V1_SX300.jpg"} })
```
