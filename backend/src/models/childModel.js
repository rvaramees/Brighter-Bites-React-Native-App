import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const childSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for the child"],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, "Please provide the child's age"],
    },
    // --- NEW FIELD ADDED HERE ---
    gender: {
      type: String,
      // Using an enum ensures only these values can be stored.
      enum: ['Male', 'Female', 'Prefer not to say'],
      required: [true, "Please select a gender"],
    },
    // ----------------------------
    password: {
      type: String,
      required: [true, "Please provide a simple password"],
      minlength: 4,
      maxlength: 4,
      select: false,
    },
    avatar: {
      type: String,
      default: 'default_avatar_url_or_name.png',
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Parent',
    },
    parentName: {
      type: String,
      required: true,
    },
    preferences: {
      morningBrushTime: {
        type: String,
        default: '08:00',
      },
      nightBrushTime: {
        type: String,
        default: '20:00',
      },
    },
    points: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
childSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
childSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Child = mongoose.model('Child', childSchema);

export default Child;