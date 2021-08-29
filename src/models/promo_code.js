const mongoose = require("mongoose");

const modelName = "Promo_Code";
const PromoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: new Date() },
  expiredAt: { type: Date, required: true },
  isExpired: { type: Boolean, default: false },
});
PromoCodeSchema.options.toJSON = {
  transform: function (doc, ret) {
    delete ret._id;
  },
};
const PromoCodeModel = mongoose.model(modelName, PromoCodeSchema);
module.exports = {
  PromoCodeSchema,
  PromoCodeModel,
};
