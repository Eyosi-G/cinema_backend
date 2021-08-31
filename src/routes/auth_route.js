const router = require("express").Router();
const jwt = require("../utils/jwt");
const { UserModel } = require("../models/user");
const config = require("../../config");
const AppError = require("../utils/appError");
router.post("/login", async (req, res, next) => {
  try {
    console.log(req.body)
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
});

module.exports = router;
