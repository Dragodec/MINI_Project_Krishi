const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  // Extract token from HttpOnly cookie instead of Authorization header
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Authentication required. Please login." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch user and exclude password from the request object
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(404).json({ error: "User no longer exists." });
    }
    
    next();
  } catch (err) {
    // If token is expired or tampered with
    res.status(401).json({ error: "Session expired. Please login again." });
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "You do not have permission to perform this action" });
    }
    next();
  };
};