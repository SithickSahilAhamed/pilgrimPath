const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.userId = user._id;
    req.userRole = user.role;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const adminAuth = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
};

const moderatorAuth = (req, res, next) => {
  if (!['admin', 'moderator'].includes(req.userRole)) {
    return res.status(403).json({ message: 'Access denied. Moderator role required.' });
  }
  next();
};

module.exports = { auth, adminAuth, moderatorAuth };
