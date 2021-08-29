const mongoose = require("mongoose");
const movie = require("./movie");
const cinemaHall = require("./cinema_hall");
const modelName = "Schedule";
const PriceSchema = new mongoose.Schema(
  {
    vip: { type: Number, default: 0 },
    regular: { type: Number, default: 0 },
  },
  { _id: false }
);
const SeatTakenSchema = new mongoose.Schema({
  seats: {
    type: [
      {
        row: { type: Number, required: true },
        col: { type: Number, required: true },
        seatName: { type: String, required: true },
      },
    ],
  },
  owner: { type: String, required: true },
  paid: { type: Boolean, default: false },
  start_date: { type: Date, default: Date.now },
});

const ScheduleSchema = new mongoose.Schema({
  status: { type: String, enum: ["active", "inactive"], default: "inactive" },
  movie: { type: movie.movieSchema, required: true },
  start_date_time: { type: Date, required: true },
  hall: { type: cinemaHall.CinemaHallSchema, required: true },
  price: { type: PriceSchema, required: true },
  screen: { type: String, required: true },
  taken_seats: [{ type: SeatTakenSchema }],
});

ScheduleSchema.options.toJSON = {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
};

const SheduleModel = mongoose.model(modelName, ScheduleSchema);
module.exports = {
  ScheduleSchema,
  SheduleModel,
};
