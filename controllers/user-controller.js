const asyncWrapper = require("../utils/async-wrapper");
const validationError = require("../utils/validation-error");
const UserService = require("../services/user-service");

const getAllUsers = asyncWrapper(async (req, res) => {
  const users = await UserService.getAll();

  res.status(200).json({ message: "Users successfully retrieved!", users });
});

const signup = asyncWrapper(async (req, res) => {
  validationError(req);

  const {
    firstName,
    lastName,
    birthday,
    address,
    username,
    password,
    email,
    phone,
    userType,
  } = req.body;

  const newUser = await UserService.signup({
    firstName,
    lastName,
    birthday,
    address,
    username,
    password,
    email,
    phone,
    userType,
  });

  res.status(201).json({ message: "Successfully signed up!", newUser });
});

const login = asyncWrapper(async (req, res) => {
  validationError(req);

  const { username, password } = req.body;

  const token = await UserService.login({ username, password });

  res.status(200).json({ message: "Successfully logged in!", token });
});

const getLoggedInUser = asyncWrapper(async (req, res) => {
  const { userId } = req.user;

  const user = await UserService.currentUser(userId);

  res
    .status(200)
    .json({ message: "Logged in user info successfully retrieved!", user });
});

module.exports = { getAllUsers, signup, login, getLoggedInUser };
