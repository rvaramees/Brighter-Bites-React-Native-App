// Make sure these are imported at the top of the file
import Child from '../../models/childModel.js';
import generateToken from '../../utils/generateToken.js';

// ... your other controller functions like registerParent and loginParent ...

/**
 * @desc    Authenticate a child and get a token
 * @route   POST /api/auth/child/login
 * @access  Public
 */
const loginChild = async (req, res) => {
  // 1. Destructure username and password from the request body
  const { childname, password } = req.body;

  console.log(childname);
  console.log(password);

  // 2. Basic Validation: Ensure credentials are provided
  // if (!childname || !password) {
  //   return res.status(400).json({ message: 'Please provide a username and password' });
  // }

  try {
    // 3. Find the child in the database by their unique username
    // We must use .select('+password') because the password field is hidden by default in the model
    const child = await Child.findOne({ name: childname }).select('+password');
    console.log(child);
    // 4. Validate the child and password
    // First, check if a child with that name was found.
    // Then, use the `matchPassword` method from the model to securely compare the provided password with the stored hash.
    if (child && (await child.matchPassword(password))) {
      console.log("Passwords match");
      // 5. Credentials are valid, so generate a JWT for this child
      // The `generateToken` utility is called with the child's ID and the crucial 'child' type.
      const token = generateToken(child._id, 'child');

      // 6. Send the successful response to the client
      // The frontend will use this token for future authorized requests.
      res.status(200).json({
        message: 'Child login successful',
        token: token,
        user: {
          _id: child._id,
          name: child.name,
          type: 'child', // Explicitly declare the type for the frontend
          // You can include other non-sensitive child data here, like avatar, points, etc.
        },
      });
    } else {
      // 7. If the child was not found or the password did not match
      res.status(401).json({ message: 'Invalid name or password' });
    }
  } catch (error) {
    // 8. Catch any unexpected server errors
    console.error('Child Login Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export default loginChild;