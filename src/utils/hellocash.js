const fetch = require("node-fetch");
const config = require("../../config");

const generateAuthToken = async () => {
  const requestBody = {
    principal: config.principal,
    credentials: config.credentials,
    system: config.system,
  };
  const response = await fetch(config.api.endpoints.authenticate, {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: {
      "content-type": "application/json",
    },
  });
  const data = await response.json();
  return data.token;
};
const createInvoice = async ({
  amount,
  numOfSeats,
  phonenumber,
  tracenumber,
  expires,
}) => {
  const requestBody = {
    amount: amount,
    description: `cinema** please pay ${amount} ETB to reserve ${numOfSeats} seats.`,
    from: phonenumber,
    currency: "ETB",
    tracenumber: tracenumber,
    notifyfrom: true,
    notifyto: true,
    expires: expires,
  };
  const token = await generateAuthToken();
  const response = await fetch(config.api.endpoints.invoices, {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
  });
  const data = await response.json();
  console.log(data)
  return data;
};
module.exports.createInvoice = createInvoice;
