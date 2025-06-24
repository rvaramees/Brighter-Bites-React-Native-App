import mongoose from 'mongoose';

/**
 * Habit Schema
 *
 * Represents a custom habit created by a parent and assigned to a specific child.
 * This model acts as a "template" for the tasks that will be added to the
 * child's DailyRecord each day.
 */
const habitSchema = new mongoose.Schema({
  /**
   * The name of the habit. This is what the child will see.
   * e.g., "Make Your Bed", "Feed the Dog", "Practice Piano"
   */
  name: {
    type: String,
    required: [true, 'Please provide a name for the habit.'],
    trim: true, // Removes whitespace from both ends of a string
    maxlength: [100, 'Habit name cannot be more than 100 characters.'],
  },

  /**
   * An optional, more detailed description of the habit for the parent's reference.
   */
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters.'],
  },
  
  /**
   * A reference to the Parent who created and owns this habit.
   * This is crucial for ensuring a parent can only see and manage their own created habits.
   */
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent', // Must match the model name you used for your parent schema
    required: true,
  },

  /**
   * A reference to the Child this habit is assigned to.
   * This allows a parent to assign different habits to different children.
   */
  child: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child', // Must match the model name you used for your child schema
    required: true,
  },

  /**
   * An optional field for a simple icon name (e.g., from FontAwesome or Ionicons)
   * that the frontend can use to display a visual cue for the habit.
   */
  icon: {
    type: String,
    default: 'star', // A sensible default icon
  },

  /**
   * A flag to easily enable or disable a habit without deleting it.
   * When creating a new DailyRecord, only habits where `isActive` is true will be included.
   * A parent can "pause" a habit by setting this to false.
   */
  isActive: {
    type: Boolean,
    default: true,
  },

}, {
  // Automatically add `createdAt` and `updatedAt` timestamps
  timestamps: true,
});

// To improve query performance, create an index on the fields that will be
// commonly used for lookups, like finding all habits for a specific child.
habitSchema.index({ child: 1, isActive: 1 });

const Habit = mongoose.model('Habit', habitSchema);

export default Habit;