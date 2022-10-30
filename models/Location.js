const { Schema, model } = require("mongoose");

const locationSchema = new Schema({
  adminIds: {
    type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  houseNumber: {
    type: String,
  },
  street: {
    type: String,
    required: true,
  },
  barangay: {
    type: String,
    required: true,
  },
  zipcode: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
});

module.exports = model("Location", locationSchema);
