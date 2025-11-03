// Middleware to sanitize user input and prevent malicious characters
export const sanitizeInput = (req, res, next) => {
  // Loop through all keys in the request body
  for (let key in req.body) {
    // Check if the value is a string
    if (typeof req.body[key] === "string") {
      // Remove potentially harmful characters like <, >, $, and ;
      req.body[key] = req.body[key].replace(/[<>$;]/g, "");
    }
  }
  // Move to the next middleware or route handler
  next();
};
