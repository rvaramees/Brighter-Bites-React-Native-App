import jwt from 'jsonwebtoken';

/**
 * Generates a JWT for a given user ID and type.
 * @param {string} id - The user's MongoDB document ID.
 * @param {string} type - The type of user ('parent' or 'child').
 * @returns {string} The generated JWT.
 */
export const generateToken = (id, type) => {
  if (!id || !type) {
    throw new Error('User ID and type are required to generate a token.');
  }
  
  const payload = {
    id,
    type, // <-- The crucial part!
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateToken;
// This function generates a JWT token for a user based on their ID and type.