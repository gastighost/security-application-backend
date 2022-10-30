require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createError = require("../utils/create-error");

class UserService {
  async getAll() {
    const users = await User.find().select(["_id", "username"]);

    return users;
  }

  async signup({
    firstName,
    lastName,
    birthday,
    address,
    username,
    password,
    email,
    phone,
    userType,
  }) {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      throw createError("User with this username already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      firstName,
      lastName,
      birthday,
      address,
      username,
      password: hashedPassword,
      email,
      phone,
      userType,
    });

    return newUser;
  }

  async login({ username, password }) {
    const user = await User.findOne({ username });

    if (!user) {
      throw createError("Username or password was wrong.");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw createError("Username or password was wrong.");
    }

    const token = jwt.sign(
      {
        data: {
          userId: user._id,
        },
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return token;
  }

  async currentUser(userId) {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw createError("User with this id not found", 400);
    }

    return user;
  }
}

module.exports = new UserService();
