import User from "../models/users.model.js";
import Product from "../models/products.model.js";
import apperror from "../utils/apperror.js";

import asyncwrapper from "../middlewares/asyncwrapper.js";

const addToCart = asyncwrapper(async (req, res) => {
  const { productId } = req.body;
  if (!productId) {
    throw new apperror("Product ID is required", 400, "fail");
  }
  const { id } = req.user;
  const user = await User.findById(id);
  if (!user) {
    throw new apperror("User not found", 404, "fail");
  }
  const product = await Product.findById(productId);
  if (!product) {
    throw new apperror("Product not found", 404, "fail");
  }
  const productIndex = user.cart.findIndex(
    (p) => p.product.toString() === productId,
  );
  if (productIndex !== -1) {
    user.cart[productIndex].quantity += 1;
  } else {
    user.cart.push({ product: productId, quantity: 1 });
  }
  await user.save();
  res.status(200).json({ status: "success", data: { user } });
});

const removeFromCart = asyncwrapper(async (req, res) => {
  const { productId } = req.body;
  if (!productId) {
    throw new apperror("Product ID is required", 400, "fail");
  }
  const { id } = req.user;
  const user = await User.findById(id);
  if (!user) {
    throw new apperror("User not found", 404, "fail");
  }
  user.cart = user.cart.filter((p) => p.product.toString() !== productId);
  await user.save();
  res.status(200).json({ status: "success", data: { user } });
});

const clearCart = asyncwrapper(async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id);
  if (!user) {
    throw new apperror("User not found", 404, "fail");
  }
  user.cart = [];
  await user.save();
  res.status(200).json({ status: "success", data: { user } });
});

const getCart = asyncwrapper(async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id).populate("cart.product");
  if (!user) {
    throw new apperror("User not found", 404, "fail");
  }
  res.status(200).json({ status: "success", data: { cart: user.cart } });
});

const updateCartItem = asyncwrapper(async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || quantity === undefined) {
    throw new apperror("Product ID and quantity are required", 400, "fail");
  }
  const { id } = req.user;
  const user = await User.findById(id);
  if (!user) {
    throw new apperror("User not found", 404, "fail");
  }

  const productIndex = user.cart.findIndex(
    (p) => p.product.toString() === productId,
  );
  if (productIndex !== -1) {
    user.cart[productIndex].quantity = quantity;
    await user.save();
  }
  res.status(200).json({ status: "success", data: { user } });
});

export { addToCart, removeFromCart, clearCart, getCart, updateCartItem };
