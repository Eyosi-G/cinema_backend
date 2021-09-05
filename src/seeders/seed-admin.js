require("../../config/db");
const roles = require("../../config/constants/roles");
const user = require("../models/user");

user.UserModel.create({
  username: "Eyo.siyas",
  password: "password",
  roles: [roles.admin],
}).then((data)=>console.log('admin created !'))
