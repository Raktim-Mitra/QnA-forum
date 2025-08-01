// middlewares/auth.js
import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attaches { id, email, role } to req.user
    next();
  } catch (err) {
    console.error(err);
    return res.status(403).json({ message: "Invalid token." });
  }
};

export default verifyToken;
