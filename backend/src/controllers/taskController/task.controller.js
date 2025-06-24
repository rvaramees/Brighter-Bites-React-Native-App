import Child from '../../models/childModel.js';
import DailyRecord from '../../models/dailyRecordModel.js';
import Habit from '../../models/habitModel.js'; // Assuming you have a Habit model
import mongoose from 'mongoose';

// ====================================================================
// --- INTERNAL HELPER FUNCTIONS (Not exported) ---
// These functions support the main controllers.
// ====================================================================

/**
 * Gets the start of the current day in UTC for consistent date querying across timezones.
 * @returns {Date} - A Date object set to 00:00:00 UTC for the current day.
 */
const getStartOfToday = () => {
  const now = new Date();
  // This creates a date object that represents the beginning of today, UTC.
  // e.g., if it's 2023-10-27 anywhere in the world, this will be 2023-10-27T00:00:00.000Z
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
};

/**
 * Finds the DailyRecord for a given child for today. If it doesn't exist,
 * it creates a new one, pre-populating it with the child's active custom habits.
 * This is the central helper for all task operations.
 * @param {string} childId - The ID of the child.
 * @returns {Promise<Document>} - The Mongoose document for today's DailyRecord.
 */
const findOrCreateTodaysRecord = async (childId) => {
  const today = getStartOfToday();
  
  let record = await DailyRecord.findOne({ child: childId, date: today });

  if (!record) {
    // Record for today doesn't exist, so we create it.
    // Fetch all active custom habits set by the parent for this child.
    const customHabits = await Habit.find({ child: childId, isActive: true });
    
    // Format the habits for inclusion in the new DailyRecord.
    const habitsForRecord = customHabits.map(habit => ({
      habitId: habit._id,
      name: habit.name,
      status: 'Pending',
    }));

    // Create the new record document in the database.
    record = await DailyRecord.create({
      child: childId,
      date: today,
      customHabits: habitsForRecord,
    });
  }

  return record;
};

 /* Increments the score on the Child model.
 * @param {string} childId - The ID of the child whose score to increment.
 */
const incrementChildScore = async (childId) => {
  try {
    // Use MongoDB's $inc operator for an atomic increment operation.
    // This is efficient and safe for concurrent operations.
    await Child.findByIdAndUpdate(childId, { $inc: { score: 1 } });
  } catch (error) {
    // Log this error but don't stop the main request.
    // The main task was completed, failing to update the score is a
    // secondary issue that shouldn't cause the entire request to fail.
    console.error(`Failed to increment score for child ${childId}:`, error);
  }
};

/**
 * After a custom habit is completed, this function checks if all custom habits
 * for the day are done. If so, it awards the 'allHabits' star.
 * @param {string} recordId - The ID of the DailyRecord to check.
 * @returns {Promise<Document>} - The potentially updated DailyRecord document.
 */
const _checkAndAwardHabitStar = async (recordId) => {
  const record = await DailyRecord.findById(recordId);
  if (!record) throw new Error('Record not found for habit star check.');

  // Check if every habit in the array has the status 'Completed'.
  const allHabitsDone = record.customHabits.every(h => h.status === 'Completed');

  // If all are done AND the star hasn't been awarded yet, update the record.
  if (allHabitsDone && !record.stars.allHabits) {
    return DailyRecord.findByIdAndUpdate(recordId, { $set: { 'stars.allHabits': true } }, { new: true });
  }

  // Otherwise, just return the record as is.
  return record;
};


// ====================================================================
// --- EXPORTED CONTROLLER FUNCTIONS ---
// These are the functions used by your routes.
// ====================================================================

/**
 * @desc    Get all tasks and their statuses for the logged-in child for today.
 * @route   GET /api/tasks/today
 * @access  Private (Child)
 */
export const getTodaysTasks = async (req, res) => {
  try {
    // The `authorize('child')` middleware ensures req.user exists and is a child.
    const childId = req.user._id;
    const todaysRecord = await findOrCreateTodaysRecord(childId);
    res.status(200).json(todaysRecord);
  } catch (error) {
    console.error('Error in getTodaysTasks:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Mark a specific task as complete for the logged-in child.
 * @route   POST /api/tasks/:taskType/complete
 * @access  Private (Child)
 */
export const completeTask = async (req, res) => {
  const { taskType } = req.params;
  const { habitId } = req.body;
  const childId = req.user._id;

  try {
    const record = await findOrCreateTodaysRecord(childId);
    let updatedRecord;
    let starAwarded = false; // Flag to check if we need to increment the score

    switch (taskType) {
      case 'morningBrush':
        // Only award a star (and score) if it hasn't been awarded yet
        if (!record.stars.morningBrush) {
          updatedRecord = await DailyRecord.findByIdAndUpdate(record._id, { $set: { 'morningBrush.status': 'Completed', 'morningBrush.completedAt': new Date(), 'stars.morningBrush': true }}, { new: true });
          starAwarded = true;
        } else {
          updatedRecord = record; // No change needed
        }
        break;
      
      case 'nightBrush':
        if (!record.stars.nightBrush) {
          updatedRecord = await DailyRecord.findByIdAndUpdate(record._id, { $set: { 'nightBrush.status': 'Completed', 'nightBrush.completedAt': new Date(), 'stars.nightBrush': true }}, { new: true });
          starAwarded = true;
        } else {
          updatedRecord = record;
        }
        break;
      
      case 'dailyChallenge':
        // The daily challenge doesn't award a star, but we could add points here if we wanted
        updatedRecord = await DailyRecord.findByIdAndUpdate(record._id, { $set: { 'dailyChallenge.status': 'Completed', 'challengeCompleted': true }}, { new: true });
        break;
      
      case 'customHabit':
        if (!habitId) {
          return res.status(400).json({ message: 'A habitId is required.' });
        }
        
        const tempRecord = await DailyRecord.findByIdAndUpdate(
          record._id,
          { $set: { 'customHabits.$[elem].status': 'Completed' } },
          { new: true, arrayFilters: [{ 'elem.habitId': new mongoose.Types.ObjectId(habitId) }] }
        );

        // Check if this completion earned the "all habits" star
        const previousHabitStarState = tempRecord.stars.allHabits;
        updatedRecord = await _checkAndAwardHabitStar(tempRecord._id);
        
        // If the star state changed from false to true, award a point
        if (!previousHabitStarState && updatedRecord.stars.allHabits) {
            starAwarded = true;
        }
        break;
      
      default:
        return res.status(400).json({ message: 'Invalid task type provided.' });
    }

    // If any star was awarded in this transaction, increment the child's total score.
    if (starAwarded) {
      await incrementChildScore(childId);
    }
    
    res.status(200).json(updatedRecord);
  } catch (error) {
    console.error(`Error completing task '${taskType}':`, error);
    res.status(500).json({ message: 'Server Error' });
  }
};
/**
 * @desc    Get daily records for a calendar view.
 * @route   GET /api/tasks/calendar
 * @access  Private (Parent or Child)
 */
export const getCalendarData = async (req, res) => {
    // A parent can request data for a specific child via query params.
    // A child can only get their own data.
    const childId = req.user.type === 'parent' ? req.query.childId : req.user._id;

    if (!childId) {
        return res.status(400).json({ message: 'Child ID is required for this request.' });
    }

    try {
        // Example: Fetch the last 30 days of records for the specified child.
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const records = await DailyRecord.find({ 
            child: childId,
            date: { $gte: thirtyDaysAgo }
        }).sort({ date: -1 });

        res.status(200).json(records);
    } catch (error) {
        console.error('Error fetching calendar data:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Adds a newly created habit to the current day's DailyRecord.
 * @route   POST /api/tasks/today/add-habit
 * @access  Private (Parent)
 */
export const addHabitToTodaysRecord = async (req, res) => {
  // The parent's frontend will send the ID of the habit they just created
  // and the ID of the child it was for.
  const { habitId, childId } = req.body;
  const parentId = req.user._id;

  // 1. Validation
  if (!habitId || !childId) {
    return res.status(400).json({ message: 'habitId and childId are required.' });
  }

  try {
    // 2. Fetch both the habit and the child to perform security checks.
    const [habit, child] = await Promise.all([
      Habit.findById(habitId),
      Child.findById(childId),
    ]);

    // 3. Security & Sanity Checks
    if (!habit || !child) {
      return res.status(404).json({ message: 'Habit or Child not found.' });
    }
    // Ensure the parent calling this API owns both the habit and the child.
    if (habit.parent.toString() !== parentId.toString() || child.parent.toString() !== parentId.toString()) {
      return res.status(403).json({ message: 'Not authorized to perform this action.' });
    }
    // Ensure the habit is actually assigned to this child.
    if (habit.child.toString() !== childId.toString()) {
        return res.status(400).json({ message: 'This habit is not assigned to the specified child.' });
    }

    // 4. Get today's DailyRecord (this will create it if it doesn't exist)
    const todaysRecord = await findOrCreateTodaysRecord(childId);

    // 5. Check if the habit is already in today's list to prevent duplicates
    const habitExistsInRecord = todaysRecord.customHabits.some(
      (h) => h.habitId.toString() === habitId
    );
    if (habitExistsInRecord) {
      return res.status(409).json({ message: 'This habit is already on today\'s list.' });
    }

    // 6. Add the new habit to the customHabits array in today's record
    const newHabitForRecord = {
      habitId: habit._id,
      name: habit.name,
      status: 'Pending',
    };

    todaysRecord.customHabits.push(newHabitForRecord);

    // Since we added a new pending habit, the 'allHabits' star might no longer be valid if it was already earned.
    // We should reset it to false.
    todaysRecord.stars.allHabits = false;
    
    const updatedRecord = await todaysRecord.save();

    res.status(200).json(updatedRecord);
  } catch (error) {
    console.error('Error adding habit to today\'s record:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateTodayRecord = async (req, res) => {
  console.log("Updating record");
  const today = getStartOfToday();
  const childId = req.body.childId;
  let record = await DailyRecord.findOne({ child: childId, date: today });

  if (record) {
    const customHabits = await Habit.find({ child: childId, isActive: true });
    
    // Format the habits for inclusion in the new DailyRecord.
    const habitsForRecord = customHabits.map(habit => ({
      habitId: habit._id,
      name: habit.name,
      status: 'Pending',
    }));
    // Create the new record document in the database.
    record = await DailyRecord.updateOne({
      child: childId,
      date: today,
      customHabits: habitsForRecord,
    });
  }

  return res.status(200).json(record);
}