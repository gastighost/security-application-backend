const { Router } = require("express");
const { body } = require("express-validator");
const {
  signup,
  login,
  getLoggedInUser,
  getAllUsers,
} = require("../controllers/user-controller");
const auth = require("../middleware/auth");

const router = Router();

router.get("/", getAllUsers);

router.post(
  "/signup",
  [
    body("firstName", "First name must be provided")
      .trim()
      .exists({ checkFalsy: true }),
    body("lastName", "First name must be provided")
      .trim()
      .exists({ checkFalsy: true }),
    body("birthday", "Birthday must be a valid date")
      .toDate()
      .isISO8601()
      .bail()
      .customSanitizer((date) => date.toLocaleString("en-US")),
    body("address", "Address must be provided")
      .trim()
      .exists({ checkFalsy: true }),
    body("username", "Username must be provided")
      .trim()
      .exists({ checkFalsy: true }),
    body("password", "Password must be provided")
      .trim()
      .exists({ checkFalsy: true }),
    body("email", "Please provide a valid email").trim().isEmail(),
    body("phone", "Please provide a valid phone number").trim().isMobilePhone(),
    body(
      "userType",
      "User type must be either admin, resident, visitor or worker"
    ).isIn(["admin", "resident", "visitor", "worker"]),
  ],
  signup
);

router.post(
  "/login",
  [
    body("username", "Please provide a username")
      .trim()
      .exists({ checkFalsy: true }),
  ],
  login
);

router.get("/current-user", auth, getLoggedInUser);

module.exports = router;
