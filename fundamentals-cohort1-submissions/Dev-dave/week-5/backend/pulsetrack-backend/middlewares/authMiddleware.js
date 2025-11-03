import jwt from "jsonwebtoken"; // Import JWT library to verify tokens
import TokenBlacklist from "./models/Tokenblacklist.js" // Import blacklist model to check for revoked tokens

// Middleware to authenticate users using JWT
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; // Get the Authorization header from request
    if (!authHeader) return res.status(401).json({ message: "No token provided" }); // If missing, deny access

    const token = authHeader.split(" ")[1]; // Extract the token part from "Bearer <token>"
    const blacklisted = await TokenBlacklist.findOne({ token }); // Check if token is blacklisted (revoked)
    if (blacklisted) return res.status(401).json({ message: "Token revoked" }); // If revoked, deny access

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify and decode the token using secret key
    req.user = decoded; // Attach decoded user data (e.g., id, role) to request object
    next(); // Proceed to the next middleware or route
  } catch {
    res.status(403).json({ message: "Invalid token" }); // If token is invalid or expired, deny access
  }
};
