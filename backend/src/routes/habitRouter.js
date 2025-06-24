import express from 'express';

// Import the controller functions
import {
  createHabit,
  getHabits,
  updateHabit,
  deleteHabit,
} from '../controllers/taskController/habit.controller.js';

// Import our authorization middleware
import { authorize } from '../middleware/authMiddleware.js';

// Create a new router instance
const router = express.Router();

// The base path for this router will be '/api/habits' as defined in server.js

// ====================================================================
// --- DEFINE THE ROUTES ---
// We chain the middleware and controller functions to the route definitions.
// The `authorize` middleware runs first. If it passes, it calls `next()`,
// which then runs the corresponding controller function.
// ====================================================================

/**
 * @route   POST /api/habits
 * @desc    Create a new custom habit.
 * @access  Private (Parent only)
 */
router.post('/add', authorize('parent'), createHabit);

/**
 * @route   GET /api/habits
 * @desc    Get habits.
 *          - A parent must provide a `?childId=` query to get all habits for that child.
 *          - A child will automatically get their own active habits.
 * @access  Private (Parent or Child)
 */
router.get('/', authorize('parent', 'child'), getHabits);

/**
 * @route   PUT /api/habits/:id
 * @desc    Update a specific habit (e.g., change name, toggle isActive).
 * @access  Private (Parent only)
 */
router.put('/:id', authorize('parent'), updateHabit);

/**
 * @route   DELETE /api/habits/:id
 * @desc    Delete a specific habit.
 * @access  Private (Parent only)
 */
router.delete('/:id', authorize('parent'), deleteHabit);


// Export the router so it can be used by the main server file
export default router;