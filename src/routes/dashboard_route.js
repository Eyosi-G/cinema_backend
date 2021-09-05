const router = require("express").Router();
const { CinemaHallModel } = require("../models/cinema_hall");
const { movieModel } = require("../models/movie");
const { TicketModel } = require("../models/ticket");
const auth  = require('../middlewares/auth')
getDashboardData = async (req, res, next) => {
  try {
    const cinemas = await CinemaHallModel.countDocuments();
    const movies = await movieModel.countDocuments();
    const tickets = await TicketModel.countDocuments();
    return res.json({
      cinemas: cinemas,
      movies: movies,
      bookings: tickets,
    });
  } catch (e) {
    next(e);
  }
}

router.get("/dashboard", auth.validateUser, auth.isAdmin, getDashboardData );

module.exports = router;
