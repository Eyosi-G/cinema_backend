const router = require("express").Router();
const { TicketModel } = require("../models/ticket");
router.get("/tickets", async (req, res, next) => {
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
});

module.exports = router;
