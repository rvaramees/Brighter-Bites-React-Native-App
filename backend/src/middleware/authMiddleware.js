import jwt from 'jsonwebtoken';
import Parent from '../models/parentModel.js';
import Child from '../models/childModel.js';

/**
 * Middleware to protect routes and authorize based on user type.
 * @param {...string} allowedTypes - The user types allowed to access the route (e.g., 'parent', 'child').
 */
export const authorize = (...allowedTypes) => {
  return async (req, res, next) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        // 1. Get token from header
        token = req.headers.authorization.split(' ')[1];
        console.log('Token received:', token);
        if (!token) {
          return res.status(401).json({ message: 'Not authorized, no token' });
        }
        // 2. Verify token and get payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Check if the token's type is one of the allowed types
        if (allowedTypes.length > 0 && !allowedTypes.includes(decoded.type)) {
          return res.status(403).json({ message: 'Forbidden: You do not have the required permissions' });
        }

        // 4. Fetch user from DB based on type and attach to request
        if (decoded.type === 'parent') {
          req.user = await Parent.findById(decoded.id).select('-password');
        } else if (decoded.type === 'child') {
          req.user = await Child.findById(decoded.id).select('-password');
        }

        // 5. Ensure user exists
        if (!req.user) {
          return res.status(401).json({ message: 'Not authorized, user not found' });
        }
        
        // Add the type to the user object for convenience
        req.user.type = decoded.type;

        next(); // User is authenticated and authorized
      } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Not authorized, token failed' });
      }
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
  };
};

// You can also export a simple 'protect' if you just want to check for any valid login
export const protect = authorize(); // Calling with no args allows any authenticated user