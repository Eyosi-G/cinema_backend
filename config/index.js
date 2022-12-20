require("dotenv").config();
const common = {
  base_url: "https://testapi.yenepay.com/api",
};
const config = {
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  key: process.env.key,
  principal: process.env.HC_PRINCIPAL,
  credentials: process.env.HC_CREDENTIALS,
  merchantId: process.env.MERCHANT_ID,
  system: process.env.HC_SYSTEM,
  min: 10,
  api: {
    url: common.base_url,
    endpoints: {
      checkout: `${common.base_url}/urlgenerate/getcheckouturl`,
      verifyIPN: `${common.base_url}/verify/ipn `
    },
  },
  saltFactor:Number(process.env.SALT_FACTOR),
};
module.exports = config;
