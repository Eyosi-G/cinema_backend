const axios = require("axios");
const config = require("../../config");
const generateItems = (seats, grid, vip, regular) => {
  const items = seats.map((seat) => {
    let row = seat.row;
    let col = seat.col;
    let isVip = grid[row][col].isVip;
    let seatName = grid[row][col].seatName;
    const item = {
      itemName: seatName,
      unitPrice: isVip ? vip : regular,
      quantity: 1,
    };
    return item;
  });
  return items;
};

const generateCheckoutRequest = (
  items,
  merchantId,
  merchantOrderId,
  expAfter
) => ({
  process: items.length > 0 ? "Cart" : "Express",
  merchantOrderId: merchantOrderId,
  merchantId: merchantId,
  items: items,
  expiresAfter: expAfter,
});

const generateCheckoutURL = async (requestBody) => {
  const response = await axios.post(config.api.endpoints.checkout, requestBody);
  const link = response.data.result;
  return link;
};

const verifyIPN = async (requestBody) => {
  const response = await axios.post(
    config.api.endpoints.verifyIPN,
    requestBody
  );
  return response.data == "VERIFIED";
};
module.exports.generateItems = generateItems;
module.exports.generateCheckoutRequest = generateCheckoutRequest;
module.exports.generateCheckoutURL = generateCheckoutURL;
module.exports.verifyIPN = verifyIPN;
