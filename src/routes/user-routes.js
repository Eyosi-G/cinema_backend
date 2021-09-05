const router = require("express").Router();
const { UserModel } = require("../models/user");
const auth = require("../middlewares/auth");
const getUsers = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 0;
    const page = Number(req.query.page) || 0;
    const name = req.query.name || false;
    const query = {};
    if (name) query.username = new RegExp(name, "i");
    const users = await UserModel.find(query)
      .skip(page * limit)
      .limit(limit);
    const size = await UserModel.countDocuments(query);
    res.json({
      size,
      users,
    });
  } catch (error) {
    next(error);
  }
};
const createUser = async (req, res, next) => {
  try {
    const { roles, password, username } = req.body;
    const user = await UserModel.create({ roles, username, password });
    res.json(user);
  } catch (error) {
    next(error);
  }
};
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findByIdAndDelete(id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};
const updateRole = async (req, res, next) => {
  try {
    const id = req.params.id;
    const roles = req.body;
    const user = await UserModel.findByIdAndUpdate(
      id,
      {
        roles: roles,
      },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    next(error);
  }
}
router.get("/users", auth.validateUser, auth.isAdmin, getUsers);
router.post("/users", auth.validateUser, auth.isAdmin, createUser);
router.delete("/users/:id", auth.validateUser, auth.isAdmin, deleteUser);
router.patch(
  "/users/:id/roles",
  auth.validateUser,
  auth.isAdmin,
  updateRole
);
module.exports = router;
