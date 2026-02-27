import {
  getUsers,
  registerUser,
  getUser,
  updateUser,
  deleteUser,
  loginUser,
  addadmin,
  deactivateUser,
} from "../controllers/users.controller.js";
import express from "express";
import verifytoken from "../middlewares/verifyToken.js";
import verifyAdmin from "../middlewares/verifyadmin.js";

const router = express.Router();

router.route("/").get(verifytoken, verifyAdmin, getUsers);
router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router
  .route("/:userId")
  .get(verifytoken, getUser)
  .put(verifytoken, updateUser)
  .delete(verifytoken, deleteUser);
router.route("/addadmin").post(verifytoken, verifyAdmin, addadmin);
router
  .route("/deactivate/:userId")
  .put(verifytoken, verifyAdmin, deactivateUser);

export default router;
