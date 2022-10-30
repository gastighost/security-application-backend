require("dotenv").config();
const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Successfully connected to db via Mongoose!");
};

module.exports = connectDb;
