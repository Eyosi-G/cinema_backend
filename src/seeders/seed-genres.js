const genreModel = require("../models/genre");

require("../../config/db");
const genres = [
  { name: "horror" },
  { name: "adventure" },
  { name: "romance" },
  { name: "drama" },
  { name: "sci-fi" },
  { name: "comedy" },
  { name: "thriller" },
  { name: "documentary" },
  { name: "musical" },
  { name: "war" },
  { name: "animation" },
  { name: "fantasy" },
  { name: "epic" },
];

genreModel
  .insertMany(genres)
  .then((data) => console.log("genres inserted successfuly"))
  .catch((err) => console.log("inserting genres failed"));
