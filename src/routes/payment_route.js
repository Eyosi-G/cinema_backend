const router = require("express").Router();
const config = require("../../config");
const jwt = require("../utils/jwt");
const schedule = require("../models/schedule");
const helloCash = require("../utils/hellocash");
const payment = require("../models/payment");
const mongoose = require("mongoose");
const ticket = require("../models/ticket");
const sendEmail = require("../utils/email");
const createTicket = require("../utils/ticket");
const AppError = require("../utils/appError");

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

router.post("/ipn", async (req, res, next) => {
  const { tracenumber, amount, status } = req.body;
  const paymentDoc = await payment.PaymentModel.findById(tracenumber);
  if (status === "PROCESSED" && paymentDoc) {
    paymentDoc.paid = true;
    await paymentDoc.save();
    const decoded = await jwt.verifyToken(paymentDoc.token, config.key);
    const { owner, checkoutId, scheduleId } = decoded;
    const scheduleDoc = await schedule.SheduleModel.findById(scheduleId);
    const checkout = scheduleDoc.taken_seats.id(checkoutId);
    if (checkout.owner == owner) {
      //check the person who sent the ticket is the one who bought
      checkout.paid = true;
      await scheduleDoc.save();
      //create ticket
      const scheduleDateTime = scheduleDoc.start_date_time;
      const cinemaHallName = scheduleDoc.hall.name;
      const movie = scheduleDoc.movie;
      const screen = scheduleDoc.screen;
      const amountPaid = amount;
      const seats = checkout.seats;
      const email = paymentDoc.email;

      await ticket.TicketModel.create({
        schedule_date_time: scheduleDateTime,
        cinema_hall_name: cinemaHallName,
        movie: movie,
        amount_paid: amountPaid,
        seats: seats,
        _id:tracenumber
      });
      //send ticket to provided email
      const ticketFile = await createTicket({
        hallName: cinemaHallName,
        screen: screen,
        price: amountPaid,
        seats: seats.map((seat) => seat.seatName).toString(),
        showDataTime: new Date(scheduleDateTime).toLocaleString(),
        title: movie.title,
        token: paymentDoc.token,
      });
      await sendEmail({
        emailTo: email,
        file: ticketFile,
        fileName: "ticket.png",
        subject: "ticket",
      });
    }
  }
  res.status(200).end();
});

router.post("/invoices", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = await jwt.verifyToken(token, config.key);
    const { checkoutId, scheduleId } = decoded;
    const { email, phonenumber } = req.body;
    const response = await schedule.SheduleModel.findById(scheduleId);
    const checkout = response.taken_seats.id(checkoutId);
    if (config.min - Math.abs((new Date() - checkout.start_date) / 60000) > 0) {
      const totalPrice = calculateTotalPrice(
        checkout.seats,
        response.hall.seats.grid,
        response.price.vip,
        response.price.regular
      );
      const numOfSeats = checkout.seats.length;
      let reservedAt = new Date(checkout.start_date);
      reservedAt.setMinutes(reservedAt.getMinutes() + config.min);
      const expiresAt = reservedAt;
      const paymentId = mongoose.Types.ObjectId();

      console.log(req.body)
      const { code } = await helloCash.createInvoice({
        amount: totalPrice,
        expires: expiresAt,
        phonenumber: phonenumber,
        numOfSeats: numOfSeats,
        tracenumber: paymentId,
      });
      await payment.PaymentModel.create({
        _id: paymentId,
        email: email,
        phonenumber: phonenumber,
        token: token,
        amount: totalPrice,
      });
      return res.json({ code: code });
    }
    throw new AppError(401, "reserved seat expired!");
  } catch (error) {
    next(error);
  }
});
module.exports = router;
