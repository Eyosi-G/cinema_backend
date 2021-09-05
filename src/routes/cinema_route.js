const router = require("express").Router();
const { CinemaHallModel } = require("../models/cinema_hall");
const auth = require('../middlewares/auth');
const createCinema = async (req, res, next) => {
  try {
    const cinema = await CinemaHallModel.create(req.body);
    res.json(cinema);
  } catch (error) {
    next(error);
  }
};
const getCinemas = async (req, res, next) => {
  try {
    const limit = (req.query.limit && Number(req.query.limit)) || 0;
    const page = (req.query.page && Number(req.query.page)) || 0;
    const name = req.query.name || false;
    const query = {};
    if (name) query.name = new RegExp(`${name}`, "i");
    const size = await CinemaHallModel.countDocuments(query);
    const cinemas = await CinemaHallModel.find(query)
      .skip(page * limit)
      .limit(limit);
    res.json({ size: size, cinemas: cinemas });
  } catch (error) {
    next(error);
  }
};
const deleteCinema = async (req, res, next) => {
  try {
    const id = req.params.id;
    const cinemas = await CinemaHallModel.findByIdAndDelete(id);
    res.json(cinemas);
  } catch (error) {
    next(error);
  }
};
const getSingleCinema = async (req, res, next) => {
  try {
    const id = req.params.id;
    const cinemas = await CinemaHallModel.findById(id);
    res.json(cinemas);
  } catch (error) {
    next(error);
  }
};
const updateCinema =  async (req, res, next) => {
  try {
    const cinemaID = req.body.cinemaID;
    const cinema = await CinemaHallModel.findByIdAndUpdate(cinemaID, req.body, {
      new: true,
    });
    res.json(cinema);
  } catch (error) {
    next(error);
  }
}

router.delete("/cinemas/:id", auth.validateUser,auth.isAdmin, deleteCinema);
router.get("/cinemas",auth.validateUser, auth.isAdmin, getCinemas);
router.post("/cinemas", auth.validateUser, auth.isAdmin, createCinema);
router.get("/cinemas/:id",auth.validateUser, auth.isAdmin, getSingleCinema);
router.put("/cinemas",auth.validateUser, auth.isAdmin, updateCinema);
module.exports = router;
