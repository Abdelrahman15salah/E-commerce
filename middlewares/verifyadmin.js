const verifyAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ status: "error", message: "Access denied" });
  }
};

export default verifyAdmin;
