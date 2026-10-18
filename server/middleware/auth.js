import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'portfolio-secret-change-me';

export const signToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    jwtSecret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};
