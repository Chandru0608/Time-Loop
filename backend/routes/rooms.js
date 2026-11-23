import { Router } from "express";
import crypto from "crypto";
import Room from "../models/Room.js";
import { auth } from "../middleware/auth.js";
const router = Router();
const code = () => crypto.randomBytes(3).toString("hex").toUpperCase();

router.post("/", auth, async (req, res) => {
  try {
    let roomCode = code();
    while (await Room.exists({ roomCode })) roomCode = code();
    const room = await Room.create({
      roomCode, host: req.user._id,
      players: [{ user: req.user._id, username: req.user.username, ready: true, connected: true }]
    });
    res.status(201).json({ room });
  } catch { res.status(500).json({ message: "Could not create room." }); }
});

router.post("/join", auth, async (req, res) => {
  try {
    const roomCode = req.body.roomCode?.trim().toUpperCase();
    const room = await Room.findOne({ roomCode });
    if (!room) return res.status(404).json({ message: "Room not found." });
    if (room.status !== "waiting") return res.status(400).json({ message: "This investigation has already started." });
    if (room.players.some(p => String(p.user) === String(req.user._id))) return res.json({ room });
    if (room.players.length >= 4) return res.status(400).json({ message: "Room is full (maximum 4 investigators)." });
    room.players.push({ user: req.user._id, username: req.user.username, connected: true });
    await room.save();
    res.json({ room });
  } catch { res.status(500).json({ message: "Could not join room." }); }
});

router.get("/:code", auth, async (req, res) => {
  const room = await Room.findOne({ roomCode: req.params.code.toUpperCase() }).populate("host", "username");
  if (!room || !room.players.some(p => String(p.user) === String(req.user._id))) return res.status(404).json({ message: "Room not found." });
  res.json({ room });
});
export default router;
