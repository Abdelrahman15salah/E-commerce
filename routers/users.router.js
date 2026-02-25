import {
  getUsers,
  addUser,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/users.controller.js";
import express from "express";

const router = express.Router();

router.route("/").get(getUsers).post(addUser);
router.route("/:userId").get(getUser).put(updateUser).delete(deleteUser);

export default router;
