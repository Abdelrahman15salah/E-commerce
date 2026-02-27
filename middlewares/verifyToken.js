import jwt from "jsonwebtoken";
import User from "../models/users.model.js";

const verifytoken = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res
        .status(401)
        .json({ message: "User is deactivated or not found" });
    }
    req.user = user;

    next();
  } catch (err) {
    return res
      .status(401)
      .json({ status: "fail", message: "unauthorized access" });
  }
};

export default verifytoken;
