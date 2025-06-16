import Parent from '../../models/parentModel.js';
import generateToken from '../../utils/generateToken.js';

const loginUser = async (req, res) => {
    try{
        console.log("Received login request with data:", req.body);
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Check if parent exists
        const parent = await Parent.findOne({ email });
        if (!parent) {
            return res.status(404).json({ message: "Invalid credentials" });
        }

        // Compare passwords
        const isMatch = await parent.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = generateToken(parent._id, 'parent');
        console.log("Generated token for parent:", token);
        const parentname = parent.parentname; // Fallback to 'Parent' if parentname is not set
        // Respond with the token and parent details
        return res.status(200).json({
            token,
            user: {
                _id: parent._id,
                name: parentname,
                email: parent.email,
                type: 'parent',
            }
        });
    } catch (error) {
        console.error("Error during parent login:", error);
        return res.status(500).json({ message: `Internal server error. ${error}` });
    }
};

// Export the router
export default loginUser;