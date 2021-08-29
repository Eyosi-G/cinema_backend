const mongoose = require("mongoose");
const modelName = "Genre";
const genreSchema = new mongoose.Schema({
  name: { type: String, require: true },
});
genreSchema.options.toJSON = {
  transform: function (doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
  }
};
const genreModel = mongoose.model(modelName, genreSchema);
module.exports = genreModel;
