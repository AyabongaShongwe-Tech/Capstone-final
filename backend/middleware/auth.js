const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verifies the JWT from the `token` cookie and attaches the user to req.
const protect = async (req, res, next) => {
  try {
    // Read the JWT from the "token" cookie set by the browser.
    const token = req.cookies && req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Not authorized, no token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user (without the password) to the request object
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res
        .status(401)
        .json({ message: 'Not authorized, user no longer exists' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: 'Not authorized, token failed', error: error.message });
  }
};

// Restricts a route to users whose role is included in the allowed list.
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Requires role: ${roles.join(' or ')}`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
