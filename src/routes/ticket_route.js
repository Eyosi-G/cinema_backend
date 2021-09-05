const router = require("express").Router();
const { TicketModel } = require("../models/ticket");
const crypto = require("crypto");
const auth = require("../middlewares/auth");
const getTickets = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 0;
    const limit = Number(req.query.limit) || 0;
    const date = req.query.date || false;
    const query = {};
    if (date) {
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.createdAt = {
        $gte: new Date(date).toISOString(),
        $lt: endDate.toISOString(),
      };
    }
    const total = await TicketModel.countDocuments(query);
    const tickets = await TicketModel.find(query)
      .skip(page * limit)
      .limit(limit);
    const priceSum = tickets.reduce((preValue, currentValue) => {
      preValue += currentValue.amount_paid;
      return preValue;
    }, 0);
    res.json({
      size: total,
      tickets: tickets,
      totalPrice: priceSum,
    });
  } catch (error) {
    next(error);
  }
};
const getTicketByCode = async (req, res, next) => {
  try {
    const { code } = req.body;
    const hashedCode = crypto
      .createHash("md5")
      .update(code.trim())
      .digest("hex");
    const ticket = await TicketModel.findOne({ code: hashedCode });
    res.json(ticket);
  } catch (error) {
    next(error);
  }
};

const approveTicket =   async (req, res, next) => {
  try {
    const id = req.params.id;
    const ticket = await TicketModel.findByIdAndUpdate(
      id,
      {
        approved: true,
        approvedBy: req.user.username,
      },
      { new: true }
    );
    res.json(ticket);
  } catch (error) {
    next(error);
  }
}

router.get("/tickets", auth.validateUser, auth.isAdmin, getTickets);
router.post("/tickets", auth.validateUser,  auth.isTicketer, getTicketByCode);
router.patch(
  "/tickets/:id/approve",
  auth.validateUser,
  auth.isTicketer,
  approveTicket

);
module.exports = router;
