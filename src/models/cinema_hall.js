const mongoose = require("mongoose");
const modelName = "Cinema_Hall";
const CinemaHallSchema = new mongoose.Schema({
  name: { type: String, required: true },
  num_of_seats:{type: Number, required: true},
  seats: {
    rows: { type: Number, required: true },
    cols: { type: Number, required: true },
    grid: {},
  },
});
// rows:{
//     "0":{
//         isVip:false,
//         isTaken:false,
//     }    
// }
CinemaHallSchema.options.toJSON = {
  transform: function (doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
  }
};
const CinemaHallModel = mongoose.model(modelName, CinemaHallSchema);
module.exports = { CinemaHallSchema, CinemaHallModel };
