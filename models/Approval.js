const { Schema, model } = require("mongoose");

const approvalSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    locationId: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    dateTimeFrom: {
      type: String,
      required: true,
    },
    dateTimeTo: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    validated: {
      type: Boolean,
      default: false,
    },
    validatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = model("Approval", approvalSchema);
