const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  const secrets = [process.env.JWT_SECRET, process.env.ADMIN_JWT_SECRET].filter(Boolean);

  // Cookie takes priority (dashboard); Authorization: Bearer is the fallback (Flutter app).
  let rawToken =
    req.cookies?.admin_jwt ||
    (req.headers.authorization?.startsWith('Bearer')
      ? req.headers.authorization.split(' ')[1]
      : null);

  if (!rawToken) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  let decoded = null;
  for (const secret of secrets) {
    try {
      decoded = jwt.verify(rawToken, secret);
      break;
    } catch (_) {
      decoded = null;
    }
  }

  if (!decoded) {
    res.status(401);
    throw new Error('Not authorized, token failed');
  }

  req.user = await User.findById(decoded.id).select('-password');
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized, user not found');
  }

  return next();
});

const requireRole = (role) =>
  asyncHandler(async (req, res, next) => {
    if (req.user && req.user.role === role) {
      return next();
    }
    res.status(403);
    throw new Error('Forbidden');
  });

module.exports = { protect, requireRole };
