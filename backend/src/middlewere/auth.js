import jwt from "jsonwebtoken";
import User from "../config/models/user.js";

export const protectRoute = async (req, res, next) => {
  try {
    let token = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    const secret = process.env.JWT_SECRET || "thinkboard_jwt_secret_secure_key_2026_x89q";
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found or token invalid" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Auth middleware error:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
