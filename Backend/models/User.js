import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" }, // Default should be "user"
  },
  {
    timestamps: true,
  }
);

// Ensure the model is only created once
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
