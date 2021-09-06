const config = require("../../config");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const createTransport = async() => {
  const playGround = "https://developers.google.com/oauthplayground";
  const OAuth2 = google.auth.OAuth2;

  const oauthClient = new OAuth2(
    config.oAuthClientId,
    config.oAuthClientSecret,
    playGround
  );

  oauthClient.setCredentials({
    refresh_token: config.oAuthRefreshToken,
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauthClient.getAccessToken((err, token) => {
      if (err) {
        reject("Failed to create access token :(");
      }
      resolve(token);
    });
  });
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: config.mailerEmail,
      clientId: config.oAuthClientId,
      clientSecret: config.oAuthClientSecret,
      refreshToken: config.oAuthRefreshToken,
      accessToken: accessToken,
    },
  });

  return transport;
};

const sendEmail = async ({ emailTo, subject, code, image, ticket }) => {
  const transporter = await createTransport();
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
