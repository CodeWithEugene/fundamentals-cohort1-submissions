function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ error: 'Access denied: No role assigned' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied: Insufficient permissions',
        required: allowedRoles,
        current: req.user.role
      });
    }
    
    next();
  };
}
module.exports = requireRole;
