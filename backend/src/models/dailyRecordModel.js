import mongoose from 'mongoose';

const dailyRecordSchema = new mongoose.Schema({
  // Link to the child this record belongs to
  child: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true,
  },
  // The specific date this record is for. We'll store it at the start of the day for easy querying.
  date: {
    type: Date,
    required: true,
  },
  // --- Core Brushing Tasks ---
  // Store the actual completion time for detailed reports
  morningBrush: {
    completedAt: { type: Date, default: null },
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' }
  },
  nightBrush: {
    completedAt: { type: Date, default: null },
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' }
  },

  // --- Custom Habits ---
  // An array of objects to track each custom habit for the day
  customHabits: [{
    habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit' }, // Link to a potential 'Habit' collection
    name: { type: String, required: true }, // Store name for quick display
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' }
  }],

  // --- Daily Challenge ---
  dailyChallenge: {
    challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' },
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' }
  },

  // --- Calculated Summary (For Your UI) ---
  // We can calculate and store these values for fast retrieval on the dashboard
  stars: {
    morningBrush: { type: Boolean, default: false }, // Star 1
    nightBrush: { type: Boolean, default: false },   // Star 2
    allHabits: { type: Boolean, default: false },    // Star 3
  },
  challengeCompleted: { type: Boolean, default: false } // For the "golden" effect
}, {
  timestamps: true,
});

// Create a compound index to ensure one record per child per day
dailyRecordSchema.index({ child: 1, date: 1 }, { unique: true });


// A virtual property to easily calculate the total stars
dailyRecordSchema.virtual('starCount').get(function() {
  let count = 0;
  if (this.stars.morningBrush) count++;
  if (this.stars.nightBrush) count++;
  if (this.stars.allHabits) count++;
  return count;
});

// Ensure virtuals are included when converting to JSON
dailyRecordSchema.set('toJSON', { virtuals: true });

const DailyRecord = mongoose.model('DailyRecord', dailyRecordSchema);

export default DailyRecord;