import jwt from "jsonwebtoken";
import User from "../models/Auth/UserModel.js";
import Session from "../models/Auth/SessionModel.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer "))
      return res.status(401).json({ message: "No token provided." });

    const token = authHeader.split(" ")[1];

    // Check blacklist (logged-out tokens)
    const blacklisted = await Session.findOne({ token });
    if (blacklisted) return res.status(401).json({ message: "Token has been invalidated. Please log in again." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user    = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User no longer exists." });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

// Role guard — usage: restrictTo("admin")
export const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({ message: "You do not have permission to perform this action." });
  next();
};