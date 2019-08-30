const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const movieSchema = new Schema({
  scoutbase_rating: Number,
  title: String,
  year: Number,
  rating: Number,
  actors: {
    name: String,
    birthday: String,
    country: String,
    directors: {
      name: String,
      birthday: String,
      country: String
    }
  }
});

module.exports = mongoose.model("Movie", movieSchema);
