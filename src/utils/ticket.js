const qrCode = require("qrcode");
const nodeHtmlToImage = require("node-html-to-image");
const fs = require("fs");
const generateQRCode = async (data) => {
  const dataURL = await qrCode.toDataURL(data);
  return dataURL;
};

const createTicket = async ({token,price,title,showDataTime,seats,hallName, screen}) => {
  const image = await generateQRCode(token)
  const ticketTemplate = fs.readFileSync(`${__dirname}/../../tickets/ticket.html`, "utf8");
  return await nodeHtmlToImage({
    html: ticketTemplate,
    selector: ".ticket-wrapper",
    content: { image, price, title,showDataTime,seats,hallName, screen },
  });
};

module.exports = createTicket;
