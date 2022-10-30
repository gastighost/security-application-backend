const { Router } = require("express");
const { body } = require("express-validator");
const {
  createLocation,
  getLocation,
  getAllLocations,
  editLocation,
} = require("../controllers/location-controller");
const auth = require("../middleware/auth");

const router = Router();

router.get("/", getAllLocations);

router.post("/", auth, createLocation);

router.get("/:locationId", auth, getLocation);

router.patch(
  "/:locationId",
  auth,
  [body("zipcode", "Zipcode must be a number").isInt().toInt()],
  editLocation
);

module.exports = router;
