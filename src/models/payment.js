const mongoose = require("mongoose");
const modelName = "Payment";
const paymentSchema = new mongoose.Schema({
  email: { type: String, required: true },
  reservedSeatId: {type: String, required: true},
  scheduleId: {type: String, required:true},
  amount: { type: Number, required: true },
  paid: { type: Boolean, default: false },
});
paymentSchema.options.toJSON = {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
};
const PaymentModel = mongoose.model(modelName, paymentSchema);
module.exports = { paymentSchema, PaymentModel };
