const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");

verifyToken = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  token = token.replace("Bearer ", "");

  jwt.verify(token,
    config.secret,
    (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized! Token expired.",
        });
      }

      req.personId = decoded.id;
      next();
    });
};

const authJwt = {
  verifyToken
};
module.exports = authJwt;
