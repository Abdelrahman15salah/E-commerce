import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userroutes from "./routers/users.router.js";
import connectDB from "./config/DB.js";
import asyncwrapper from "./middlewares/asyncwrapper.js";
import productroutes from "./routers/products.router.js";
import cartroutes from "./routers/cart.router.js";
import orderroutes from "./routers/orders.router.js";
const PORT = process.env.PORT || 3000;
dotenv.config();
const app = express();
app.use(cors());
connectDB();
app.use(express.json());
app.use("/api/users", userroutes);
app.use("/api/products", productroutes);
app.use("/api/cart", cartroutes);
app.use("/api/orders", orderroutes);
app.get("/*splat", async (req, res) => {
  res.status(404).json({ status: "error", message: "Route not found" });
});

app.use(async (error, req, res, next) => {
  res
    .status(error.statusCode || 500)
    .json({ status: error.statustext || "error", message: error.message });
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
