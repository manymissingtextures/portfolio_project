const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required.');
  }
  return process.env.JWT_SECRET;
};

const generateToken = (user) => {
  const userId = typeof user === 'string' ? user : user._id;
  const role = typeof user === 'string' ? 'user' : (user.role || 'user');

  return jwt.sign(
    { id: userId, role },
    getJwtSecret(),
    {
      expiresIn: '1d',
    },
  );
};

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      getJwtSecret(),
    );
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

const optionalProtect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Invalid authorization header.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    req.user = jwt.verify(
      token,
      getJwtSecret(),
    );
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required.' });
  }
  next();
};

module.exports = {
  generateToken,
  protect,
  optionalProtect,
  requireAdmin,
};
