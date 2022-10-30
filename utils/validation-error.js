const { validationResult } = require("express-validator");
const createError = require("./create-error");

const validationError = (req) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((error) => error.msg)
      .join(", ");

    throw createError(errorMessages, 400);
  }

  return;
};

module.exports = validationError;
