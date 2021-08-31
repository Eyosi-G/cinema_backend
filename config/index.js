require("dotenv").config();
const common = {
  base_url: "https://api.hellocash.net",
};
const config = {
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORd,
  key: process.env.key,
  principal: process.env.HC_PRINCIPAL,
  credentials: process.env.HC_CREDENTIALS,
  system: process.env.HC_SYSTEM,
  min: 10,
  api: {
    url: common.base_url,
    endpoints: {
      invoices: `${common.base_url}/invoices`,
      authenticate: `${common.base_url}/authenticate`,
    },
  },
  mailerEmail:process.env.MAILER_EMIAL,
  mailerPassword:process.env.MAILER_PASSWORD,
  authKey:process.env.AUTH_KEY,
  saltFactor:Number(process.env.SALT_FACTOR)
};
module.exports = config;
