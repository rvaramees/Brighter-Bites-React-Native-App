import Parent from "../../models/parentModel.js";

export  const getParentProfile = async (req, res) => {
  try {
    // The `authorize('parent')` middleware has already run.
    // We can reliably get the parent's ID from req.user.
    const parentId = req.user._id;

    // Find the parent in the database
    const parent = await Parent.findById(parentId).select(
      '_id parentname email createdAt'
    );
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }
    res.status(200).json({ parent });
  } catch (error) {
    console.error('Error fetching parent profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};