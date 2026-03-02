import express from "express";
import {
  addToCart,
  removeFromCart,
  clearCart,
  getCart,
  updateCartItem,
} from "../controllers/cart.controller.js";
import verifytoken from "../middlewares/verifyToken.js";

const router = express.Router();

router.use(verifytoken);

router
  .route("/")
  .get(getCart)
  .post(addToCart)
  .put(updateCartItem)
  .delete(removeFromCart);

router.delete("/clear", clearCart);

export default router;
