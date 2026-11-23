import mongoose from "mongoose";
const roomSchema = new mongoose.Schema({
  roomCode: { type: String, required: true, unique: true, index: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  players: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: String,
    ready: { type: Boolean, default: false },
    connected: { type: Boolean, default: false }
  }],
  status: { type: String, enum: ["waiting", "playing", "completed"], default: "waiting" },
  currentChapter: { type: Number, default: 1 },
  currentLoop: { type: Number, default: 1 },
  timerEndsAt: Date,
  discoveredEvidence: { type: [String], default: [] },
  solvedPuzzles: { type: [String], default: [] },
  decisions: { type: mongoose.Schema.Types.Mixed, default: {} },
  eventLog: [{ type: String, createdAt: { type: Date, default: Date.now } }],
  ending: { type: String, default: null }
}, { timestamps: true });
export default mongoose.model("Room", roomSchema);
