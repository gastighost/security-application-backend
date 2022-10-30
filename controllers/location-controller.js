const asyncWrapper = require("../utils/async-wrapper");
const validationError = require("../utils/validation-error");
const LocationService = require("../services/location-service");

const getAllLocations = asyncWrapper(async (req, res) => {
  const locations = await LocationService.getAll();

  res
    .status(200)
    .json({ message: "Locations successfully retrieved!", locations });
});

const createLocation = asyncWrapper(async (req, res) => {
  validationError(req);

  const { userId } = req.user;
  const { name, houseNumber, street, barangay, zipcode, city } = req.body;

  const newLocation = await LocationService.create({
    userId,
    name,
    houseNumber,
    street,
    barangay,
    zipcode,
    city,
  });

  res
    .status(201)
    .json({ message: "Location successfully created!", newLocation });
});

const getLocation = asyncWrapper(async (req, res) => {
  const { userId } = req.user;
  const { locationId } = req.params;

  const location = await LocationService.getOne(locationId, userId);

  res
    .status(200)
    .json({ message: "Location successfully retrieved!", location });
});

const editLocation = asyncWrapper(async (req, res) => {
  validationError(req);

  const { userId } = req.user;
  const { locationId } = req.params;
  const { name, houseNumber, street, barangay, zipcode, city } = req.body;

  const updatedLocation = await LocationService.update(locationId, {
    userId,
    name,
    houseNumber,
    street,
    barangay,
    zipcode,
    city,
  });

  res
    .status(200)
    .json({ message: "Location successfully updated!", updatedLocation });
});

module.exports = { getAllLocations, createLocation, getLocation, editLocation };
