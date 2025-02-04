import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "admin" },
  },
  {
    timestamps: true,
  }
);

// Check if the model is already defined to prevent overwriting
const Admin = mongoose.models.Admin || mongoose.model("Admin", userSchema);

export default Admin;
