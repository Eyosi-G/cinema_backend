const mongoose = require("mongoose");
const config = require("..");
const devURL = `mongodb://localhost:27017/${config.dbName}`;
mongoose
  .connect(devURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((data) => console.log("database connection success"))
  .catch((err) => console.log("database connection failed"));