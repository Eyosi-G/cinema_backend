const mongoose = require("mongoose");
const roles = require("../../config/constants/roles");
const modelName = "User";
const bcrypt = require("bcrypt");
const config = require("../../config");

const UserSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  roles: {
    type: [{ type: String }],
    required: true,
    enum: Object.values(roles),
  },
});

UserSchema.pre("save", async function (next) {
  const user = this;
  try {
    const salt = await bcrypt.genSalt(config.saltFactor);
    user.password = await bcrypt.hash(user.password.trim(), salt);

    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.isPasswordCorrect = function (password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.options.toJSON = {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  },
};

const UserModel = mongoose.model(modelName, UserSchema);
module.exports = {
  UserSchema,
  UserModel,
};
