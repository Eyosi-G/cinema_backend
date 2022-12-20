const nodemailer = require("nodemailer");

const sendEmail = async ({ emailTo, subject, code, image, ticket }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    await transporter.sendMail({
      from: process.env.EMAIL,
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
  } catch (e) {
    console.log(e);
  }
};

module.exports = sendEmail;
