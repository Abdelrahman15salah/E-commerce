import express from "express";
import dotenv from "dotenv";
import userroutes from "./routers/users.router.js";
import connectDB from "./config/DB.js";
const PORT = process.env.PORT || 3000;
dotenv.config();

const app = express();
connectDB();
app.use(express.json());
app.use("/api/users", userroutes);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
