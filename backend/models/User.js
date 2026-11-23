import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true, minlength: 3, maxlength: 25 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  totalGames: { type: Number, default: 0 }
}, { timestamps: true });
export default mongoose.model("User", userSchema);
