require("./config/db");
const express = require("express");
const cors = require("cors");
const logger = require("./src/middlewares/logger");
const movieRoute = require("./src/routes/movie_route");
const genreRoute = require("./src/routes/genre_route");
const cinemaRoute = require("./src/routes/cinema_route");
const scheduleRoute = require("./src/routes/schedule_route");
const errorHandler = require("./src/middlewares/error_handler");
const paymentRoute = require("./src/routes/payment_route");
const authRoute = require("./src/routes/auth_route");
const dashboardRoute = require('./src/routes/dashboard_route')
const app = express();
const port = process.env.PORT || 8080;
app.use(logger);
app.use(cors());
app.use(express.json());
app.use("/api/v1/images", express.static(`uploads`));
app.use("/api/v1", authRoute);
app.use("/api/v1", movieRoute);
app.use("/api/v1", genreRoute);
app.use("/api/v1", cinemaRoute);
app.use("/api/v1", scheduleRoute);
app.use("/api/v1", paymentRoute);
app.use('/api/v1',dashboardRoute)
app.use(errorHandler);
app.listen(port, () => {
  console.log(`server started on port ${port} ...`);
});