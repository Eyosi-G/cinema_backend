const jwt = require("../utils/jwt");
const config = require("../../config");
const { UserModel } = require("../models/user");
const validateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = await jwt.verifyToken(token, config.authKey);
    const { id } = decoded;
    const user = await UserModel.findById(id);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports.validateUser = validateUser;
