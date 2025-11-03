import bcrypt from "bcryptjs"; // For hashing and comparing passwords
import User from "../models/User.js"; 
import TokenBlacklist from "../models/tokenblacklist.js"; 
import { generateTokens } from "../utils/generateTokens.js"; // Function to create access & refresh tokens

// ✅ Register a new user
export const register = async (req, res) => {
  const { name, email, password } = req.body; // Get user input

  const existing = await User.findOne({ email }); // Check if email already exists
  if (existing) return res.status(400).json({ message: "Email already registered" });

  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
  const user = await User.create({ name, email, password: hashedPassword }); // Save new user
  res.status(201).json({ message: "Registration successful" }); // Send success response
};

// ✅ Login user
export const login = async (req, res) => {
  const { email, password } = req.body; // Get login details

  const user = await User.findOne({ email }); // Find user by email
  if (!user) return res.status(404).json({ message: "User not found" });

  // Check if account is temporarily locked
  if (user.lockUntil && user.lockUntil > Date.now()) {
    return res.status(403).json({ message: "Account locked. Try later." });
  }

  const isMatch = await bcrypt.compare(password, user.password); // Compare passwords
  if (!isMatch) {
    user.failedAttempts += 1; // Count failed attempts
    if (user.failedAttempts >= 3) {
      // Lock account after 3 failed tries for 30 mins
      user.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
      user.failedAttempts = 0;
    }
    await user.save();
    return res.status(401).json({ message: "Invalid password" });
  }

  // Reset failed attempts on successful login
  user.failedAttempts = 0;
  user.lockUntil = null;
  await user.save();

  const tokens = generateTokens(user); // Generate access & refresh tokens
  res.json({ user, ...tokens }); // Send tokens and user info
};

// ✅ Refresh access token using refresh token
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body; // Get refresh token
  if (!refreshToken) return res.status(400).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET); // Verify token
    const user = await User.findById(decoded.id); // Find user from token
    if (!user) return res.status(404).json({ message: "User not found" });

    const tokens = generateTokens(user); // Create new tokens
    res.json(tokens);
  } catch {
    res.status(403).json({ message: "Invalid refresh token" }); // Invalid or expired token
  }
};

// ✅ Logout user and blacklist token
export const logout = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from header
  if (token) {
    const decoded = jwt.decode(token); // Decode token to get expiry
    // Store token in blacklist until it expires
    await TokenBlacklist.create({ token, expiresAt: new Date(decoded.exp * 1000) });
  }
  res.json({ message: "Logged out successfully" }); // Confirm logout
};
