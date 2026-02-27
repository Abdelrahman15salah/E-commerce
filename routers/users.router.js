import {
  getUsers,
  registerUser,
  getUser,
  updateUser,
  deleteUser,
  loginUser,
} from "../controllers/users.controller.js";
import express from "express";

const router = express.Router();

router.route("/").get(getUsers);
router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/:userId").get(getUser).put(updateUser).delete(deleteUser);

export default router;
