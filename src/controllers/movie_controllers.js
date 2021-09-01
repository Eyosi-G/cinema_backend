const { movieModel } = require("../models/movie");
const { SheduleModel } = require("../models/schedule");
const getMovies = async (req, res, next) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 0;
    const page = req.query.page ? Number(req.query.page) : 0;
    const name = req.query.name || false;
    const commingsoon = req.query.commingsoon || false;
    const query = {};
    if (name) query.title = new RegExp(`${name}`, "i");
    if (commingsoon) query.comming_soon = true;

    const totalMovies = await movieModel.countDocuments(query);
    const paginated = await movieModel
      .find(query)
      .skip(page * limit)
      .limit(limit);
    res.json({ size: totalMovies, movies: paginated });
  } catch (error) {
    next(error);
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    await movieModel.findByIdAndDelete(id);
    res.status(200).end();
  } catch (error) {
    next(error);
  }
};
const updateMovie = async (req, res, next) => {
  try {
    const {
      movieId,
      title,
      genres,
      duration,
      release_date,
      casts,
      summary,
      language,
      comming_soon,
    } = req.body;
    const body = {};
    if (title) body.title = title;
    if (genres) body.genres = genres;
    if (comming_soon) body.comming_soon = comming_soon;
    if (duration) body.duration = duration;
    if (release_date) body.release_date = release_date;
    if (casts) body.casts = casts;
    if (summary) body.summary = summary;
    if (language) body.language = language;
    if (req.file) body.cover_image = req.file.filename;
    const response = await movieModel.findByIdAndUpdate(
      movieId,
      {
        ...body,
      },
      {
        new: true,
      }
    );
    res.json(response);
  } catch (e) {
    next(e);
  }
};
const createMovie = async (req, res, next) => {
  try {
    console.log(req.body);
    const {
      title,
      genres,
      duration,
      release_date,
      casts,
      summary,
      language,
      comming_soon,
    } = req.body;
    const body = {};
    if (title) body.title = title;
    if (genres) body.genres = genres;
    if (comming_soon) body.comming_soon = comming_soon;
    if (duration) body.duration = duration;
    if (release_date) body.release_date = release_date;
    if (casts) body.casts = casts;
    if (summary) body.summary = summary;
    if (language) body.language = language;
    if (req.file) body.cover_image = req.file.filename;
    const response = await movieModel.create(body);
    res.json(response);
  } catch (e) {
    next(e);
  }
};
const getSingleMovie = async (req, res, next) => {
  try {
    const id = req.params.id;
    const movie = await movieModel.findById(id);
    res.json(movie);
  } catch (error) {
    next(error);
  }
};

const getMovieDetail = async (req, res, next) => {
  try {
    const id = req.params.id;
    const schedules = await SheduleModel.find({ "movie._id": id }).select({
      hall: 0,
      price: 0,
    });
    const detail = {
      schedules: [],
    };
    schedules
      .filter((schedule) => {
        return new Date() < new Date(schedule.start_date_time);
      })
      .forEach((schedule) => {
        detail.genres = schedule["movie"].genres;
        detail.casts = schedule["movie"].casts;
        detail.title = schedule["movie"].title;
        detail.release_date = schedule["movie"].release_date;
        detail.summary = schedule["movie"].summary;
        detail.language = schedule["movie"].language;
        detail.cover_image = schedule["movie"].cover_image;
        detail.duration = schedule["movie"].duration;
        detail.schedules.push({
          start_date_time: schedule["start_date_time"],
          screen: schedule["screen"],
          id: schedule["_id"],
        });
      });
    res.json(detail);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMovie,
  getMovies,
  deleteMovie,
  updateMovie,
  getSingleMovie,
  getMovieDetail,
};
