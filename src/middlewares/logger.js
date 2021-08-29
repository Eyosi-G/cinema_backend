const logger = (req, res, next) => {
  let url = req.url;
  let method = req.method;
  console.log(`url => ${method} : ${url}`);
  next();
};

module.exports = logger