import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller.js";
import express from "express";
import verifytoken from "../middlewares/verifyToken.js";
import verifyAdmin from "../middlewares/verifyadmin.js";
const router = express.Router();

router.route("/").get(getProducts);
router.route("/addproduct").post(verifytoken, verifyAdmin, addProduct);
router.route("/:productId").put(verifytoken, verifyAdmin, updateProduct);
router.route("/:productId").delete(verifytoken, verifyAdmin, deleteProduct);
export default router;
