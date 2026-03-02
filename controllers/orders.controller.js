import Order from "../models/orders.model.js";
import User from "../models/users.model.js";
import Product from "../models/products.model.js";
import asyncwrapper from "../middlewares/asyncwrapper.js";
import apperror from "../utils/apperror.js";

const createOrder = asyncwrapper(async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;
  const { id } = req.user;

  const user = await User.findById(id).populate("cart.product");
  if (!user || user.cart.length === 0) {
    throw new apperror("Cart is empty or user not found", 400, "fail");
  }

  let totalPrice = 0;
  const orderItems = [];
  const bulkOps = [];

  for (const item of user.cart) {
    const product = item.product;
    if (!product) {
      throw new apperror("Product in cart not found", 404, "fail");
    }
    if (product.stock < item.quantity) {
      throw new apperror(
        `Insufficient stock for product: ${product.name}`,
        400,
        "fail",
      );
    }

    totalPrice += product.price * item.quantity;
    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price,
    });

    bulkOps.push({
      updateOne: {
        filter: { _id: product._id },
        update: { $inc: { stock: -item.quantity } },
      },
    });
  }

  const order = await Order.create({
    user: id,
    items: orderItems,
    totalPrice,
    shippingAddress,
    paymentMethod,
  });

  await Product.bulkWrite(bulkOps);
  user.cart = [];
  await user.save();

  res.status(201).json({ status: "success", data: { order } });
});

const getOrders = asyncwrapper(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.status(200).json({ status: "success", data: { orders } });
});

const getAllOrders = asyncwrapper(async (req, res) => {
  const orders = await Order.find().populate("user", "name email");
  res.status(200).json({ status: "success", data: { orders } });
});

const updateOrderStatus = asyncwrapper(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true },
  );
  if (!order) {
    throw new apperror("Order not found", 404, "fail");
  }
  res.status(200).json({ status: "success", data: { order } });
});

export { createOrder, getOrders, getAllOrders, updateOrderStatus };
