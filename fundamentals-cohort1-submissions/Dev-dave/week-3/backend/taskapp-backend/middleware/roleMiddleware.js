// Middleware to authorize users based on their role
export const authorize = (roles) => (req, res, next) => {
  // Check if the user's role is included in the allowed roles
  if (!roles.includes(req.user.role))
    return res.status(403).json({ message: "Access denied" }); // Deny access if not authorized
  
  next(); // Continue to the next middleware or route handler if authorized
};
