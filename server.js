require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

// ** Database connection
const connectDb = require("./config/connect-db");

// ** App middleware routes
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");

// ** API Routes
const userRoutes = require("./routes/user-routes");
const locationRoutes = require("./routes/location-routes");
const approvalRoutes = require("./routes/approval-routes");

const app = express();
const port = process.env.PORT;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", userRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/approvals", approvalRoutes);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  try {
    await connectDb();
    app.listen(port, () => console.log(`Listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
