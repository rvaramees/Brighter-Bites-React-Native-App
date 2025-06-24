import Habit from '../../models/habitModel.js';
import Child from '../../models/childModel.js';
import mongoose from 'mongoose';

// ====================================================================
// --- HABIT CONTROLLER FUNCTIONS ---
// ====================================================================

/**
 * @desc    Create a new custom habit for a specific child.
 * @route   POST /api/habits
 * @access  Private (Parent)
 */
export const createHabit = async (req, res) => {
  const { name, description, childId } = req.body;
  const parentId = req.user._id; // The logged-in parent's ID from the token
  console.log("Request Body recieved");
  // 1. Validation
  if (!name || !childId) {
    return res.status(400).json({ message: 'Name and childId are required.' });
  }

  try {
    // 2. Security Check: Ensure the child belongs to the logged-in parent.
    const child = await Child.findById(childId);
    if (!child || child.parent.toString() !== parentId.toString()) {
      return res.status(403).json({ message: 'Not authorized to add habits for this child.' });
    }

    // 3. Create and save the new habit
    const habit = await Habit.create({
      name,
      description,
      icon: "",
      parent: parentId,
      child: childId,
    });

    res.status(201).json(habit);
  } catch (error) {
    console.error('Error creating habit:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


/**
 * @desc    Get habits. For a parent, gets all habits for one of their children.
 *          For a child, gets only their own *active* habits.
 * @route   GET /api/habits
 * @access  Private (Parent or Child)
 */
export const getHabits = async (req, res) => {
  const user = req.user;

  try {
    let habits;
    if (user.type === 'parent') {
      // --- PARENT LOGIC ---
      // Parent must specify which child's habits they want to see.
      const { childId } = req.query;
      console.log(req.query);
      if (!childId) {
        return res.status(400).json({ message: 'A childId query parameter is required for parents.' });
      }

      // Security Check: Verify the parent owns this child before fetching habits.
      const child = await Child.findById(childId);
      if (!child || child.parent.toString() !== user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to view these habits.' });
      }
      
      // Fetch all habits (active and inactive) for that child.
      habits = await Habit.find({ child: childId });

    } else {
      // --- CHILD LOGIC ---
      // A child can only get their own active habits.
      habits = await Habit.find({ child: user._id, isActive: true });
    }
    
    res.status(200).json(habits);
  } catch (error) {
    console.error('Error getting habits:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


/**
 * @desc    Update a habit (e.g., change its name, or toggle isActive).
 * @route   PUT /api/habits/:id
 * @access  Private (Parent)
 */
export const updateHabit = async (req, res) => {
  const { id: habitId } = req.params;
  const { name, description, icon, isActive } = req.body;
  const parentId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(habitId)) {
    return res.status(400).json({ message: 'Invalid habit ID.' });
  }

  try {
    // 1. Find the habit to ensure it exists.
    const habit = await Habit.findById(habitId);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found.' });
    }

    // 2. Security Check: Ensure the logged-in parent owns this habit.
    if (habit.parent.toString() !== parentId.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this habit.' });
    }

    // 3. Update the fields and save.
    habit.name = name ?? habit.name;
    habit.description = description ?? habit.description;
    habit.icon = icon ?? habit.icon;
    habit.isActive = isActive ?? habit.isActive;

    const updatedHabit = await habit.save();
    res.status(200).json(updatedHabit);

  } catch (error) {
    console.error('Error updating habit:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


/**
 * @desc    Delete a habit.
 * @route   DELETE /api/habits/:id
 * @access  Private (Parent)
 */
export const deleteHabit = async (req, res) => {
  const { id: habitId } = req.params;
  const parentId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(habitId)) {
    return res.status(400).json({ message: 'Invalid habit ID.' });
  }

  try {
    // 1. Find the habit.
    const habit = await Habit.findById(habitId);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found.' });
    }

    // 2. Security Check: Ensure the parent owns the habit before deleting.
    if (habit.parent.toString() !== parentId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this habit.' });
    }

    // 3. Delete the habit.
    await habit.deleteOne(); // Replaced deprecated .remove()
    res.status(200).json({ message: 'Habit removed successfully.' });

  } catch (error) {
    console.error('Error deleting habit:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};