import Child from "../../models/childModel.js";
import Parent from "../../models/parentModel.js";

// @desc    Add a new child under the currently logged-in parent
// @route   POST /api/children/add
// @access  Private (Parent only)
export const addChild = async (req, res) => {
  // 1. Destructure all expected fields from the request body, including gender
  const { name, age, gender, password, avatar, preferences } = req.body;

  // The `authorize('parent')` middleware has already run.
  const parentId = req.user._id;
  const parentEmail = req.user.email; // Assuming parentEmail is stored in req.user
  const userType = req.user.type; // Assuming userType is stored in req.user
  const parentName = req.user.parentname; // Assuming parentname is stored in req.user
  // console.log('parentId:', parentId);
  // console.log('parentname:', parentName);
  // console.log('userType:', userType);
  // console.log('parentEmail:', parentEmail);

  // Basic validation
  if (!name || !age || !gender || !password) {
    return res.status(400).json({ message: 'Please provide a name, age, gender, and password for the child.' });
  }

  try {
    // Check if this parent already has a child with the same name.
    const childExists = await Child.findOne({ name, parent: parentId });

    if (childExists) {
      return res.status(400).json({ message: `You already have a child named '${name}'. Please choose a different name.` });
    }

    // 2. Include gender when creating the new child document
    const child = await Child.create({
      name,
      age,
      gender, // <-- Pass gender to the create method
      password,
      avatar,
      preferences,
      parent: parentId,
      parentName: parentName,
      points: 0 // Default points for a new child
    });

    if (child) {
      // 3. Include gender in the successful response object
      res.status(201).json({
        _id: child._id,
        name: child.name,
        age: child.age,
        gender: child.gender, // <-- Return gender in the response
        avatar: child.avatar,
        preferences: child.preferences.morningBrushTime,
        parentId: child.parent,
        parentName: child.parentName,
        message: `'${child.name}' has been successfully added to your family!`
      });
    } else {
      res.status(400).json({ message: 'Invalid child data provided.' });
    }
  } catch (error) {
    // This will catch validation errors from the 'enum' in the model
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Error in addChild controller:', error);
    res.status(500).json({ message: 'Server error while adding child.' });
  }
};

// ... other child controller functions ...