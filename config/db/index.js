const mongoose = require("mongoose");
const config = require("..");
const devURL = `mongodb://localhost:27017/${config.dbName}`;
const prodURL = `mongodb+srv://${config.dbUser}:${config.dbPassword}@cluster0.6soqm.mongodb.net/${config.dbName}?retryWrites=true&w=majority`
mongoose
  .connect(devURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((data) => console.log("database connection success"))
  .catch((err) => console.log("database connection failed"));
