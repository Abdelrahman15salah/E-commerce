import express from "express";
import {
  createOrder,
  getOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orders.controller.js";
import verifytoken from "../middlewares/verifyToken.js";
import verifyAdmin from "../middlewares/verifyadmin.js";

const router = express.Router();

router.use(verifytoken);

router.route("/").post(createOrder).get(getOrders);

router.route("/all").get(verifyAdmin, getAllOrders);
router.route("/:id/status").patch(verifyAdmin, updateOrderStatus);

export default router;
