const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(403).send({
      message: "No token provided",
    });
  }
  jwt.verify(token, process.env.APP_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized",
      });
    }
    req.user = user;
    next();
  });
};
