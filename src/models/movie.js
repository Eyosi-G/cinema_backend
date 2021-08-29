const mongoose = require("mongoose");

const modelName = "Movie";
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genres: { type: [String], required: true },
  duration: { type: Number, required: true },
  release_date: { type: Date, required: true },
  casts: { type: [String], required: true },
  summary: { type: String, required: true },
  language: { type: String, required: true },
  cover_image: { type: String, required: true },
  comming_soon: {type: Boolean, default: false}
});
movieSchema.options.toJSON = {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
};
const movieModel = mongoose.model(modelName, movieSchema);
module.exports = {
  movieSchema,
  movieModel,
};
