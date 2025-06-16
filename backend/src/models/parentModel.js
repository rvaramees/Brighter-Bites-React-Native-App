import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define the schema for the Parent model
const parentSchema = new mongoose.Schema({
  parentname: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password:{
    type: String,
    required: true,
    minlength: 6,
  },
  // children: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Child",
  //   },
  // ],
}, { timestamps: true });   

parentSchema.pre("save", async function (next) {

  // Check if the password is modified
  if (!this.isModified("password")) return next();
  
  // Hash the password before saving
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
  // Proceed to the next middleware
  next();
});

// Method to compare passwords
parentSchema.methods.comparePassword = async function (parentPassword) {
  return await bcrypt.compare(parentPassword, this.password);
};

// Create a model from the schema
const Parent = mongoose.model("Parent", parentSchema);

// Export the model
export default Parent;