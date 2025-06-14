import router from "../../routes/authRoutes.js";
import Parent from "../../models/parentModel.js";
import generateToken from "../../utils/generateToken.js";



// Route to handle parent registration
const registerUser = async (req, res) => {
  try{
    console.log("Received registration request with data:", req.body);
    const { email, parentname, password } = req.body;
    // Log the request body for debugging

    
    console.log("Received registration request with data:", req.body);
    // Validate input
    // Check if all fields are provided
    if (!parentname || !email || !password ) {
      return res.status(400).json(
        { message: "All fields are required" }
      );
    }
    // Check if fields meet length requirements
    if(password.length < 6) {
      return res.status(400).json(
        { message: "Password must be at least 6 characters long" }
      );
    }
    // Check if parentname is in valid format
    if(parentname.length < 3) {
      return res.status(400).json(
        { message: "Parent name must be at least 3 characters long" }
      );
    }
    // Check if phone number is in valid format
    // Check if email is in valid format
    // Simple regex for email validation
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json(
        { message: "Invalid email format" }
      );
    }

    // Check if parentname or email already exists
    const existingParent = await Parent.findOne({ parentname });
    if (existingParent) {
      return res.status(400).json(
        { message: "Parent Username already exists" }
      );
    }

    const existingEmail = await Parent.findOne({ email });
    if (existingEmail) {
      return res.status(400).json(
        { message: "Email already exists" }
      );
    } 

    // Create a new parent
    const parent = new Parent({
      parentname,
      email,
      password,
    });

    // Save the parent to the database
    await parent.save();

    const token = generateToken(parent._id, 'parent');
    console.log("Registration successful:", token);

    res.status(201).json({
      token,
      parent: {
        id: parent._id,
        parentname: parent.parentname,
        email: parent.email,
      }
    });
  }
  catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: `Internal server error ${error}`  });
  }
};

// This code defines an Express.js route for parent registration.

// It validates the input, checks for existing parent usernames and emails,
// creates a new parent, saves it to the database, generates a JWT token,
// and responds with the token and parent details.
export default registerUser;