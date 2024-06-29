import jwt from "jsonwebtoken";
import Administrator from "../models/administrator.js";
import dotenv from "dotenv";

dotenv.config();
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    const admin = await Administrator.findByPk(decoded.id, {
      include: "Hospital",
    });

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    req.admin = admin; // Attach admin info to the request
    req.hospitalId = admin.hospitalId; // Attach hospital ID to the request
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

export default authMiddleware;
