const jwt = require("../utils/jwt");
const config = require("../../config");
const { UserModel } = require("../models/user");
const roles = require("../../config/constants/roles");
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

const isAdmin = (req, res, next) => {
  try {
    if (req.user.roles.includes(roles.admin)) {
      return next();
    }
    next(new AppError(401, "unauthorized user"));
  } catch (error) {
    next(error);
  }
};
const isTicketer = (req,res,next)=>{
  try {
    if (req.user.roles.includes(roles.ticketer)) {
      return next();
    }
    next(new AppError(401, "unauthorized user"));
  } catch (error) {
    next(error);
  }
}
module.exports.validateUser = validateUser;
module.exports.isAdmin = isAdmin;
module.exports.isTicketer = isTicketer
