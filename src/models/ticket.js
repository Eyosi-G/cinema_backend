const mongoose = require("mongoose");
const movie = require("./movie");
const modelName = "Ticket";
const TicketSchema = new mongoose.Schema(
  {
    schedule_date_time: { type: Date, required: true },
    cinema_hall_name: { type: String, required: true },
    amount_paid: { type: Number, required: true },
    movie: { type: movie.movieSchema, required: true },
    seats: {
      type: [
        {
          row: { type: Number, required: true },
          col: { type: Number, required: true },
          seatName: { type: String, required: true },
        },
      ],
      required: true,
    },
  },
  {
    timestamps:{
      createdAt:true,
      updatedAt:true
    }
  }
);
TicketSchema.options.toJSON = {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
};
const TicketModel = mongoose.model(modelName, TicketSchema);
module.exports = {
  TicketSchema,
  TicketModel,
};
