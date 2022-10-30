const createError = require("../utils/create-error");
const Location = require("../models/Location");

class LocationService {
  async getAll() {
    const locations = await Location.find().select("-adminIds");

    return locations;
  }

  async create({ userId, name, houseNumber, street, barangay, zipcode, city }) {
    const newLocation = await Location.create({
      adminIds: [userId],
      name,
      houseNumber,
      street,
      barangay,
      zipcode,
      city,
    });

    return newLocation;
  }

  async getOne(locationId, userId) {
    const location = await Location.findById(locationId).populate(
      "adminIds",
      "-password"
    );

    if (!location) {
      throw createError("Location with this id was not found", 400);
    }

    const isLocationAdmin = location.adminIds.some(
      (admin) => admin._id.toString() === userId.toString()
    );

    const objectLocation = location.toObject();

    if (!isLocationAdmin) {
      delete objectLocation.adminIds;
    }

    return objectLocation;
  }

  async update(
    locationId,
    { userId, name, houseNumber, street, barangay, zipcode, city }
  ) {
    const updatedLocation = await Location.findOneAndUpdate(
      { _id: locationId, adminIds: userId },
      {
        name,
        houseNumber,
        street,
        barangay,
        zipcode,
        city,
      },
      { new: true }
    );

    if (!updatedLocation) {
      throw createError("You are not authorized to update this location", 403);
    }

    return updatedLocation;
  }
}

module.exports = new LocationService();
