const jwt = require('jsonwebtoken');

// Get JWT_SECRET from environment (set in server/index.js with validation)
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware to verify JWT token
 */
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { auth, JWT_SECRET };
