const nodemailer = require("nodemailer");
const config = require("../../config");

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

const sendEmail = async ({ emailTo, file, fileName, subject }) => {
  await transporter.sendMail({
    from: config.mailerEmail,
    to: emailTo,
    subject: subject,
    attachments: [
      {
        filename: fileName,
        content: file,
      },
    ],
  });
};

module.exports = sendEmail;
