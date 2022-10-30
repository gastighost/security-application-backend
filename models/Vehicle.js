const { Schema, model } = require("mongoose");

const vehicleSchema = new Schema({
  locationId: {
    type: Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
  plateNumber: {
    type: String,
    required: true,
  },
  validDateFrom: {
    type: String,
    required: true,
  },
  validDateTo: {
    type: String,
    required: true,
  },
});

module.exports = model("Vehicle", vehicleSchema);
