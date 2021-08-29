const router = require("express").Router();
const movieControllers = require("../controllers/movie_controllers");
const upload = require("../middlewares/file_upload");
const { movieModel } = require("../models/movie");
router.post(
  "/movies",
  upload.single("cover_image"),
  movieControllers.createMovie
);
router.get("/movies/:id", movieControllers.getSingleMovie);
router.put(
  "/movies",
  upload.single("cover_image"),
  movieControllers.updateMovie
);
router.get("/movies", movieControllers.getMovies);
router.delete("/movies/:id", movieControllers.deleteMovie);
router.get('/movies/:id/detail',movieControllers.getMovieDetail)
module.exports = router;
