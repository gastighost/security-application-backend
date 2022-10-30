require("dotenv").config();
const jwt = require("jsonwebtoken");
const createError = require("../utils/create-error");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(createError("Authorization header missing", 401));
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(createError("Bearer token is missing", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.data;
    next();
  } catch (error) {
    next(createError("Token is invalid or expired.", 401));
  }
};

module.exports = auth;
