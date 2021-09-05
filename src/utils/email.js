const nodemailer = require("nodemailer");
const config = require("../../config");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  service: "gmail",
  auth: {
    user: config.mailerEmail,
    pass: config.mailerPassword,
  },
});

const sendEmail = async ({ emailTo, subject, code, image, ticket }) => {
  await transporter.sendMail({
    from: config.mailerEmail,
    to: emailTo,
    subject: subject,
    text: `Dear customer, your payment is finished. Your ticket code is ${code}`,
    html: ticket,
    attachments: [
      {
        filename: "ticket.png",
        content: image,
      },
    ],
  });
};

module.exports = sendEmail;
