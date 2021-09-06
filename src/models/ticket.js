const mongoose = require("mongoose");
const movie = require("./movie");
const user = require("./user");
const modelName = "Ticket";
const config = require("../../config");
const crypto = require("crypto");
const TicketSchema = new mongoose.Schema(
  {
    schedule_date_time: { type: Date, required: true },
    cinema_hall_name: { type: String, required: true },
    amount_paid: { type: Number, required: true },
    screen: { type: String, requried: true },
    code: { type: String, required: true },
    movie: { type: movie.movieSchema, required: true },
    email: {type: String, required: true},
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
    approved: { type: Boolean, default: false },
    approvedBy: { type: String },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);
TicketSchema.pre("save", async function (next) {
  const ticket = this;
  try {
    console.log(
      crypto.createHash("md5").update(ticket.code.trim()).digest("hex")
    );
    ticket.code = crypto
      .createHash("md5")
      .update(ticket.code.trim())
      .digest("hex");
    return next();
  } catch (err) {
    return next(err);
  }
});
TicketSchema.options.toJSON = {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret.code;
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
