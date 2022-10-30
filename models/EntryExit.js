const { Schema, model } = require("mongoose");

const entryExitSchema = new Schema(
  {
    approvalId: {
      type: Schema.Types.ObjectId,
      ref: "Approval",
      required: true,
    },
    locationId: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    entryDate: {
      type: String,
      required: true,
    },
    exitDate: {
      type: String,
    },
    overstayed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = model("EntryExit", entryExitSchema);
