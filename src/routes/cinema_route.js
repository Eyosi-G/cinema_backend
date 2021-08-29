const router = require("express").Router();
const { CinemaHallModel } = require("../models/cinema_hall");
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

router.delete("/cinemas/:id", deleteCinema);
router.get("/cinemas", getCinemas);
router.post("/cinemas", createCinema);
router.get("/cinemas/:id", getSingleCinema);
router.put("/cinemas", async (req, res, next) => {
  try {
    const cinemaID = req.body.cinemaID;
    const cinema = await CinemaHallModel.findByIdAndUpdate(cinemaID, req.body, {
      new: true,
    });
    res.json(cinema);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
