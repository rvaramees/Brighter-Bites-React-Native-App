import Parent from '../../models/parentModel.js';

export const updateParentProfile = async (req, res) => {
    try {
        // The `authorize('parent')` middleware has already run.
        const parentId = req.user._id;
        const { parentname, email } = req.body;

        // Find the parent in the database
        const parent = await Parent.findById(parentId);
        if (!parent) {
            return res.status(404).json({ message: 'Parent not found' });
        }

        // Update the parent's profile
        parent.parentname = parentname;
        parent.email = email;
        const updatedParent = await parent.save();

        res.status(200).json({ message: 'Profile updated successfully', 
            parent: {
                _id: updatedParent._id,
                parentname: updatedParent.parentname,
                email: updatedParent.email,
            } 
        });
    } catch (error) {
        console.error('Error updating parent profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}