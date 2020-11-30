const jwt = require("jsonwebtoken");
const config = require("../../config/auth.config");
const User = require("../Models/User");

verifyToken = function(req, res, next) {
  let token = req.headers["x-access-token"];

  if (!token) {
    return  res.redirect('/signin');;
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};



const authJWT = verifyToken;

module.exports = authJWT;
