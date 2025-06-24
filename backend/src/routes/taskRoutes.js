import express from 'express';

// Import the controller functions we created
import {
  getTodaysTasks,
  completeTask,
  getCalendarData,
  addHabitToTodaysRecord,
  updateTodayRecord
} from '../controllers/taskController/task.controller.js';

// Import our authorization middleware
import { authorize } from '../middleware/authMiddleware.js';

// Create a new router instance
const router = express.Router();

// The base path for this router will be '/api/tasks' as defined in server.js

// ====================================================================
// --- CHILD-SPECIFIC ROUTES ---
// These routes can only be accessed by a logged-in child.
// ====================================================================

/**
 * @route   GET /api/tasks/today
 * @desc    Gets the daily record for the logged-in child, creating it if it doesn't exist.
 *          This is the main endpoint for the child's dashboard.
 * @access  Private (Child only)
 */
router.get('/today', authorize('child'), getTodaysTasks);

/**
 * @route   POST /api/tasks/:taskType/complete
 * @desc    A flexible endpoint to mark any type of task as complete.
 *          :taskType can be 'morningBrush', 'nightBrush', 'dailyChallenge', or 'customHabit'.
 * @access  Private (Child only)
 */
router.post('/:taskType/complete', authorize('child'), completeTask);


// ====================================================================
// --- SHARED ROUTES ---
// These routes can be accessed by multiple user types.
// ====================================================================

/**
 * @route   GET /api/tasks/calendar
 * @desc    Gets a list of daily records for a calendar view.
 *          A parent will need to provide a `?childId=` query parameter.
 *          A child will automatically get their own data.
 * @access  Private (Parent or Child)
 */
router.get('/calendar', authorize('parent', 'child'), getCalendarData);

router.post('/today/add-habit', authorize('parent'), addHabitToTodaysRecord);

router.post('/today/update', authorize('parent'), updateTodayRecord);
// Export the router so it can be used by the main server file
export default router;