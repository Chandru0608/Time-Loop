import { Router } from "express";
import Room from "../models/Room.js";
import { auth } from "../middleware/auth.js";
import { chapters } from "../data/chapters.js";
const router = Router();

router.get("/chapters", auth, (req, res) => {
  res.json({ chapters: chapters.map(c => ({ id: c.id, title: c.title, subtitle: c.subtitle, briefing: c.briefing, location: c.location, duration: c.duration, requiredClues: c.requiredClues, clues: c.clues, puzzle: { id: c.puzzle.id, title: c.puzzle.title, prompt: c.puzzle.prompt, hint: c.puzzle.hint }, choices: c.choices || [] })) });
});

router.get("/:code/state", auth, async (req, res) => {
  const room = await Room.findOne({ roomCode: req.params.code.toUpperCase() });
  if (!room || !room.players.some(p => String(p.user) === String(req.user._id))) return res.status(404).json({ message: "Room not found." });
  const chapter = chapters[room.currentChapter - 1];
  res.json({ room, chapter: publicChapter(chapter) });
});
function publicChapter(c) {
  return { id: c.id, title: c.title, subtitle: c.subtitle, briefing: c.briefing, location: c.location, duration: c.duration, requiredClues: c.requiredClues, clues: c.clues, puzzle: { id: c.puzzle.id, title: c.puzzle.title, prompt: c.puzzle.prompt, hint: c.puzzle.hint }, choices: c.choices || [] };
}
export default router;
