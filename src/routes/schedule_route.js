const router = require("express").Router();
const schedule = require("../models/schedule");
const AppError = require("../utils/appError");
const { v4 } = require("uuid");
const jwt = require("../utils/jwt");
const config = require("../../config");
const mongoose = require("mongoose");

const filterSchedules = (schedules) => {
  const filteredSchedules = {};
  schedules.forEach((schedule) => {
    if (!filteredSchedules[schedule.movie._id]) {
      filteredSchedules[schedule.movie._id] = schedule.movie;
    }
  });
  return Object.values(filteredSchedules);
};

const isSeatTaken = (takenSeats, selectedSeats) => {
  let seatTaken = false;
  for (let k = 0; k < takenSeats.length; k++) {
    let takenSeat = takenSeats[k];
    for (let i = 0; i < takenSeat.seats.length; i++) {
      for (let j = 0; j < selectedSeats.length; j++) {
        if (
          selectedSeats[j].col == takenSeat.seats[i].col &&
          selectedSeats[j].row == takenSeat.seats[i].row
        ) {
          seatTaken = true;
          break;
        }
      }
      if (seatTaken) break;
    }
    if (seatTaken) break;
  }

  return seatTaken;
};

const calculateTotalPrice = (seats, grid, vip, regular) => {
  let total = 0;
  seats.forEach((seat) => {
    let row = seat.row;
    let col = seat.col;
    let isVip = grid[row][col].isVip;
    if (isVip) total += vip;
    if (!isVip) total += regular;
  });
  return total;
};

const getSchedules = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 0;
    const limit = Number(req.query.limit) || 0;
    const query = {};
    const size = await schedule.SheduleModel.countDocuments(query);
    const schedules = await schedule.SheduleModel.find(query)
      .skip(limit * page)
      .limit(limit);
    res.json({ size: size, schedules: schedules });
  } catch (error) {
    next(error);
  }
};

const createSchedule = async (req, res, next) => {
  try {
    req.body.movie._id = req.body.movie.id;
    const response = await schedule.SheduleModel.create(req.body);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getNowWatching = async (req, res, next) => {
  try {
    const query = { start_date_time: { $gt: new Date().toISOString() } , status:"active"};
    const movies = filterSchedules(await schedule.SheduleModel.find(query));
    const moviesLength = movies.length;
    const limit = Number(req.query.limit) || moviesLength;
    const page = Number(req.query.page) || 0;
    res.json({
      movies: movies.splice(page * limit, limit),
      count: moviesLength,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleSchedule = async (req, res, next) => {
  try {
    const id = req.params.id;
    const response = await schedule.SheduleModel.findById(id);
    const takenSeats = response.taken_seats;
    const filteredSeats = takenSeats.filter((takenSeat) => {
      const startDateTime = takenSeat.start_date;
      return (
        takenSeat.paid ||
        config.min - Math.abs((new Date() - startDateTime) / 60000) > 0
      );
    });
    response.taken_seats = filteredSeats;
    const grid = response.hall.seats.grid;
    filteredSeats.forEach((filteredSeat) => {
      filteredSeat.seats.forEach((seat) => {
        let col = seat.col;
        let row = seat.row;
        grid[row][col].isTaken = true;
      });
    });
    await response.save();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const reserveSeats = async (req, res, next) => {
  try {
    const id = req.params.id;
    const selectedSeats = req.body;
    console.log(selectedSeats);
    const response = await schedule.SheduleModel.findById(id);
    if (!isSeatTaken(response.taken_seats, selectedSeats)) {
      const user = v4();
      const checkoutId = mongoose.Types.ObjectId();
      const seat = {
        seats: [...selectedSeats],
        owner: user,
        _id: checkoutId,
      };
      response.taken_seats.push(seat);
      await response.save();
      const token = await jwt.createToken(
        { owner: user, checkoutId, scheduleId: id },
        config.key
      );
      return res.json({
        token: token,
        owner: user,
        scheduleId: id,
        checkoutId,
      });
    }
    throw new AppError(401, "seats already taken");
  } catch (error) {
    next(error);
  }
};

const getCheckout = async (req, res, next) => {
  try {
    const decoded = await jwt.verifyToken(
      req.headers.authorization,
      config.key
    );
    const { owner, checkoutId, scheduleId } = decoded;
    const response = await schedule.SheduleModel.findById(scheduleId);
    const checkout = response.taken_seats.id(checkoutId);
    if (config.min - Math.abs((new Date() - checkout.start_date) / 60000) > 0) {
      const body = {};
      body.movie = response.movie;
      body.checkout = checkout;
      body.scheduleDate = response.start_date_time;
      body.screen = response.screen;
      body.totalPrice = calculateTotalPrice(
        checkout.seats,
        response.hall.seats.grid,
        response.price.vip,
        response.price.regular
      );
      return res.json(body);
    }
    throw new AppError(401, "reserved seat expired!");
  } catch (error) {
    next(error);
  }
};

const deleteSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await schedule.SheduleModel.findOneAndDelete({
      _id: id,
      status: "inactive",
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};
const editSchedule = async (req, res, next) => {
  try {
    req.body.movie._id = req.body.movie.id;
    const scheduleId = req.body.scheduleId;
    const response = await schedule.SheduleModel.findOneAndUpdate(
      { _id: scheduleId, status: "inactive" },
      req.body,
      {
        new: true,
      }
    );
    res.json(response);
  } catch (error) {
    next(error);
  }
};
const cancelReservation = async (req, res, next) => {
  try {
    const decoded = await jwt.verifyToken(
      req.headers.authorization,
      config.key
    );
    const { owner, checkoutId, scheduleId } = decoded;
    const response = await schedule.SheduleModel.findById(scheduleId);
    const checkout = response.taken_seats.id(checkoutId);
    if (checkout.owner == owner && !checkout.paid) {
      response.taken_seats.pull(checkoutId);
      await response.save();
      return res.status(200).end();
    }
    throw new AppError(401, "something went wrong");
  } catch (error) {
    next(error);
  }
};

router.get("/schedules", getSchedules);
router.post("/schedules", createSchedule);
router.put("/schedules", editSchedule);
router.delete("/schedules/:id", deleteSchedule);
router.get("/schedules/movies/now-watching", getNowWatching);
router.get("/schedules/:id", getSingleSchedule);
router.put("/schedules/:id/checkout", reserveSeats);
router.get("/checkouts", getCheckout);
router.delete("/schedules/reservation/cancel", cancelReservation);

module.exports = router;
