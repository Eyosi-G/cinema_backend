const router = require("express").Router();
const config = require("../../config");
const jwt = require("../utils/jwt");
const schedule = require("../models/schedule");
const helloCash = require("../utils/hellocash");
const yenepay = require("../utils/yenepay");
const payment = require("../models/payment");
const mongoose = require("mongoose");
const ticket = require("../models/ticket");
const generateContent = require("../utils/ticket");
const sendEmail = require("../utils/email");
const AppError = require("../utils/appError");
const crypto = require("crypto");
const pdf = require("html-pdf");

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
  const { MerchantOrderId } = req.body;
  const verify = await yenepay.verifyIPN(req.body);
  const paymentDoc = await payment.PaymentModel.findById(MerchantOrderId);
  const startDateTime = paymentDoc.start_date;
  if (verify && paymentDoc && !paymentDoc.paid &&  config.min - Math.abs((new Date() - startDateTime) / 60000) > 0) {
    paymentDoc.paid = true;
    await paymentDoc.save();
    const reservedSeatId = paymentDoc.reservedSeatId;
    const scheduleId = paymentDoc.scheduleId;
    const scheduleDoc = await schedule.SheduleModel.findById(scheduleId);
    const reservedSeat = scheduleDoc.taken_seats.id(reservedSeatId);
    reservedSeat.paid = true;
    await scheduleDoc.save();
    //create ticket
    const scheduleDateTime = scheduleDoc.start_date_time;
    const cinemaHallName = scheduleDoc.hall.name;
    const screen = scheduleDoc.screen;
    const movie = scheduleDoc.movie;
    const amountPaid = paymentDoc.amount;
    const seats = reservedSeat.seats;
    const email = paymentDoc.email;
    const code = crypto.randomBytes(8).toString("hex");

    await ticket.TicketModel.create({
      schedule_date_time: scheduleDateTime,
      cinema_hall_name: cinemaHallName,
      screen: screen,
      movie: movie,
      amount_paid: amountPaid,
      seats: seats,
      code: code,
      email: email
    });

    const { image, template } = await generateContent({
      title: movie.title,
      cinema: cinemaHallName,
      schedule: new Date(scheduleDateTime).toLocaleString("en-us", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      code: code,
      screen: screen,
      seats: seats.map((seat) => seat.seatName).toString(),
      total: `${amountPaid} ETB`,
    });
    sendEmail({
      emailTo: email,
      code: code,
      image: image,
      ticket: template,
      subject: "ticket",
    });
    return res.status(200).end()
  }
  throw new AppError(401, "invalid request!");
});

router.post("/invoices", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = await jwt.verifyToken(token, config.key);
    const { reservedSeatId, scheduleId } = decoded;
    const { email } = req.body;
    const response = await schedule.SheduleModel.findById(scheduleId);
    const reservedSeat = response.taken_seats.id(reservedSeatId);
    if (
      config.min - Math.abs((new Date() - reservedSeat.start_date) / 60000) >
      0
    ) {
      const totalPrice = calculateTotalPrice(
        reservedSeat.seats,
        response.hall.seats.grid,
        response.price.vip,
        response.price.regular
      );
      const items = yenepay.generateItems(
        reservedSeat.seats,
        response.hall.seats.grid,
        response.price.vip,
        response.price.regular
      );
      let reservedAt = new Date(reservedSeat.start_date);
      const expireAfter =
        config.min - (new Date().getMinutes() - reservedAt.getMinutes());
      const paymentId = mongoose.Types.ObjectId();

      await payment.PaymentModel.create({
        _id: paymentId,
        email: email,
        reservedSeatId: reservedSeatId,
        scheduleId: scheduleId,
        amount: totalPrice,
        start_date:reservedSeat.start_date
      });
      const checkoutRequest = await yenepay.generateCheckoutRequest(
        items,
        config.merchantId,
        paymentId,
        expireAfter
      );
      const link = await yenepay.generateCheckoutURL(checkoutRequest);
      return res.json({ code: link });
    }
    throw new AppError(401, "reserved seat expired!");
  } catch (error) {
    next(error);
  }
});
module.exports = router;
