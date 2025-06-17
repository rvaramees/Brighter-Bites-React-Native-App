import Child from "../../models/childModel.js";

export const getMyChildren = async (req, res) => {
  try {
    // 1. The `authorize('parent')` middleware has already run.
    // We can reliably get the parent's ID from req.user.
    const parentId = req.user._id;
    console.log(parentId);

    // 2. Find all children in the database where the 'parent' field matches the ID.
    // We use .select() to exclude the password and other sensitive/unnecessary fields.
    const children = await Child.find({ parent: parentId }).select(
      '_id name age avatar points'
    );

    console.log(children);
    
    // 3. Send the response.
    // If the parent has no children, this will correctly return an empty array [].
    res.status(200).json(children);

  } catch (error) {
    console.error('Error in getMyChildren controller:', error);
    res.status(500).json({ message: 'Server error while fetching your children.' });
  }
};

// ... (other controller functions you might add later) ...