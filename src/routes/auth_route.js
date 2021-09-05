const router = require("express").Router();
const jwt = require("../utils/jwt");
const { UserModel } = require("../models/user");
const config = require("../../config");
const AppError = require("../utils/appError");
const auth = require("../middlewares/auth");
const login = async (req, res, next) => {
  try {
    const { password, username } = req.body;
    const user = await UserModel.findOne({ username: username });
    if (user.isPasswordCorrect(password)) {
      const token = await jwt.createToken({ id: user._id }, config.authKey);
      return res.json({ token: token, user });
    }
    throw new AppError(401, "invalid credentials");
  } catch (error) {
    next(error);
  }
};
const changePassword = async (req, res, next) => {
  try {
    const user = req.user;
    const { oldPassword, newPassword } = req.body;
    console.log(req.body);
    if (user.isPasswordCorrect(oldPassword)) {
      user.password = newPassword;
      await user.save();
      return res.status(200).end();
    }
    throw new AppError(401, "old password is incorrect");
  } catch (error) {
    next(error);
  }
};

router.post("/login", login);
router.patch("/password", auth.validateUser, changePassword);

module.exports = router;
