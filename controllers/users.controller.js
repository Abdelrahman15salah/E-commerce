import User from "../models/users.model.js";
import asyncwrapper from "../middlewares/asyncwrapper.js";

import apperror from "../utils/apperror.js";

const getUsers = asyncwrapper(async (req, res) => {
  const paginationnumber = req.query.limit || 100;
  const page = req.query.page || 1;
  const users = await User.find()
    .select("name email isactive")
    .limit(paginationnumber)
    .skip((page - 1) * paginationnumber);
  res.status(200).json({ status: "success", data: { users } });
});

const addUser = asyncwrapper(async (req, res, next) => {
  const { name, email, password, isAdmin = false } = req.body;

  if (!name || !email || !password) {
    throw new apperror("missing fields ", 400, "fail");
  }
  if (password.length < 6) {
    throw new apperror("Password must be at least 6 characters", 400, "fail");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new apperror("User already exists", 400, "fail");
  }

  const user = await User.create({ name, email, password, isAdmin });
  res.status(201).json(user);
});
const getUser = asyncwrapper(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    throw new apperror("User not found", 404, "fail");
  }
  res.status(200).json({ status: "success", data: { user } });
});

const updateUser = asyncwrapper(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
    new: true,
  });
  if (!user) {
    throw new apperror("User not found", 404, "fail");
  }
  res.status(200).json(user);
});
const deleteUser = asyncwrapper(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.userId);
  if (!user) {
    throw new apperror("User not found", 404, "fail");
  }
  res.status(200).json({ status: "success", data: null });
});
export { getUsers, addUser, getUser, updateUser, deleteUser };
