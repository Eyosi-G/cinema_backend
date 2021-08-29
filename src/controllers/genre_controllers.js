const genreModel = require("../models/genre");
const AppError = require("../utils/appError");
const createGenre = async (req, res, next) => {
  try {
    const { name } = req.body;
    const genre = await genreModel.create({ name: name });
    res.json(genre);
  } catch (error) {
    next(error);
  }
};
const deleteGenre = async (req, res, next) => {
  try {
    const { id } = req.params;
    await genreModel.findByIdAndDelete(id);
    res.status(200).end();
  } catch (error) {
    next(error);
  }
};
const getGenres = async (req, res, next) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 0;
    const page = req.query.page ? Number(req.query.page) : 0;

    const genres = await genreModel.find();
    const paginated = await genreModel.find().skip(page).limit(limit);
    res.json({ size: genres.length, genres: paginated });
  } catch (error) {
    next(error);
  }
};

const searchGenre = async (req, res, next) => {
  try {
    const name = req.query.name || "";
    const response = await genreModel.find({ name: new RegExp(name, "i") }).limit(5);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGenre,
  deleteGenre,
  getGenres,
  searchGenre,
};
