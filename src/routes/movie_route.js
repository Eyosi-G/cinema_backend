const router = require("express").Router();
const movieControllers = require("../controllers/movie_controllers");
const multer = require('multer')
const path = require("path");
const {v4} = require('uuid')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `uploads/`);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    let filename = `${v4()}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = new RegExp("jpeg|jpg|png|gif", "i");
    const ext = path.extname(file.originalname).toLowerCase();
    const mimetype = fileTypes.test(file.mimetype);
    if (mimetype && ext) {
      return cb(null, true);
    } else {
      cb("image only");
    }
  },
});

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
router.get("/movies/:id/detail", movieControllers.getMovieDetail);
module.exports = router;
