import User from "../models/users.model.js";
import asyncwrapper from "../middlewares/asyncwrapper.js";
import bcrypt from "bcryptjs";
import apperror from "../utils/apperror.js";
import jwt from "jsonwebtoken";
const getUsers = asyncwrapper(async (req, res) => {
  const paginationnumber = parseInt(req.query.limit) || 100;
  const page = parseInt(req.query.page) || 1;
  const users = await User.find()
    .select("name email phoneNumber isActive")
    .limit(paginationnumber)
    .skip((page - 1) * paginationnumber);
  res.status(200).json({ status: "success", data: { users } });
});

const registerUser = asyncwrapper(async (req, res, next) => {
  const { name, email, password, phoneNumber = "" } = req.body;

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

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phoneNumber,
  });
  const token = jwt.sign(
    {
      email: user.email,
      id: user._id,
      isAdmin: user.isAdmin || false,
      isActive: user.isActive,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" },
  );

  res.status(201).json({
    status: "success",
    data: {
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    },
  });
});
const loginUser = asyncwrapper(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new apperror("missing fields ", 400, "fail");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new apperror("there is no user with this email", 404, "fail");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new apperror("Invalid credentials", 401, "fail");
  }
  const token = jwt.sign(
    {
      email: user.email,
      id: user._id,
      isAdmin: user.isAdmin || false,
      isActive: user.isActive,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" },
  );
  res.status(200).json({ status: "success", data: { token } });
});

const getUser = asyncwrapper(async (req, res) => {
  // Authorization: Allow only admin or the user themselves
  if (req.user._id.toString() !== req.params.userId && !req.user.isAdmin) {
    throw new apperror(
      "You are not authorized to view this profile",
      403,
      "fail",
    );
  }

  const user = await User.findById(req.params.userId).select(
    "-password -Token",
  );
  if (!user) {
    throw new apperror("User not found", 404, "fail");
  }
  res.status(200).json({ status: "success", data: { user } });
});

const updateUser = asyncwrapper(async (req, res) => {
  // Authorization: Allow only admin or the user themselves
  if (req.user._id.toString() !== req.params.userId && !req.user.isAdmin) {
    throw new apperror(
      "You are not authorized to update this profile",
      403,
      "fail",
    );
  }

  const { name, email, phoneNumber } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.userId,
    { name, email, phoneNumber },
    {
      new: true,
    },
  ).select("-password -Token");
  if (!user) {
    throw new apperror("User not found", 404, "fail");
  }
  const token = jwt.sign(
    {
      email: user.email,
      id: user._id,
      isAdmin: user.isAdmin || false,
      isActive: user.isActive,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );
  res.status(200).json({ status: "success", data: { user, token } });
});
const deleteUser = asyncwrapper(async (req, res) => {
  // Authorization: Allow only admin or the user themselves
  if (req.user._id.toString() !== req.params.userId && !req.user.isAdmin) {
    throw new apperror(
      "You are not authorized to delete this user",
      403,
      "fail",
    );
  }

  const user = await User.findByIdAndDelete(req.params.userId);
  if (!user) {
    throw new apperror("User not found", 404, "fail");
  }
  res.status(200).json({ status: "success", data: null });
});

const addadmin = asyncwrapper(async (req, res) => {
  const { name, email, password } = req.body;

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

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    isAdmin: true,
  });
  const token = jwt.sign(
    {
      email: user.email,
      id: user._id,
      isAdmin: true,
      isActive: true,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" },
  );

  res.status(201).json({
    status: "success",
    data: {
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    },
  });
});

const deactivateUser = asyncwrapper(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    throw new apperror("User not found", 404, "fail");
  }
  user.isActive = false;
  await user.save();
  res.status(200).json({ status: "success", data: { user } });
});
export {
  getUsers,
  registerUser,
  getUser,
  updateUser,
  deleteUser,
  loginUser,
  addadmin,
  deactivateUser,
};
