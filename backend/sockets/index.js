import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Room from "../models/Room.js";
import { chapters } from "../data/chapters.js";

const timers = new Map();
const publicRoom = (room) => ({
  roomCode: room.roomCode, host: String(room.host), players: room.players,
  status: room.status, currentChapter: room.currentChapter, currentLoop: room.currentLoop,
  timerEndsAt: room.timerEndsAt, discoveredEvidence: room.discoveredEvidence,
  solvedPuzzles: room.solvedPuzzles, decisions: room.decisions, ending: room.ending,
  eventLog: room.eventLog.slice(-30)
});
const chapterDuration = (room) => chapters[room.currentChapter - 1]?.duration || 180;

function emitRoom(io, room) {
  io.to(room.roomCode).emit("room:update", publicRoom(room));
}
function startTimer(io, room) {
  if (timers.has(room.roomCode)) clearInterval(timers.get(room.roomCode));
  const tick = async () => {
    const fresh = await Room.findOne({ roomCode: room.roomCode });
    if (!fresh || fresh.status !== "playing" || !fresh.timerEndsAt) {
      clearInterval(timers.get(room.roomCode)); timers.delete(room.roomCode); return;
    }
    if (Date.now() >= new Date(fresh.timerEndsAt).getTime()) {
      fresh.currentLoop += 1;
      fresh.discoveredEvidence = [...new Set(fresh.discoveredEvidence)];
      fresh.solvedPuzzles = fresh.solvedPuzzles.filter(x => x.startsWith(`chapter-${fresh.currentChapter}-`));
      fresh.eventLog.push(`Loop ${fresh.currentLoop - 1} ended. The world reset; investigators retained their memories.`);
      fresh.timerEndsAt = new Date(Date.now() + chapterDuration(fresh) * 1000);
      await fresh.save();
      io.to(fresh.roomCode).emit("game:reset", { currentLoop: fresh.currentLoop, timerEndsAt: fresh.timerEndsAt, message: "Timeline reset. Your memories remain." });
      emitRoom(io, fresh);
    }
  };
  const interval = setInterval(tick, 1000);
  timers.set(room.roomCode, interval);
}

export default function attachSockets(io) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication required"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return next(new Error("Account not found"));
      socket.user = user;
      next();
    } catch { next(new Error("Invalid session")); }
  });

  io.on("connection", socket => {
    socket.on("room:join", async ({ roomCode }, ack = () => {}) => {
      try {
        const room = await Room.findOne({ roomCode: roomCode?.toUpperCase() });
        if (!room || !room.players.some(p => String(p.user) === String(socket.user._id))) return ack({ error: "Room not found or access denied." });
        socket.join(room.roomCode);
        const player = room.players.find(p => String(p.user) === String(socket.user._id));
        player.connected = true;
        await room.save();
        emitRoom(io, room);
        ack({ room: publicRoom(room) });
      } catch { ack({ error: "Could not join room." }); }
    });

    socket.on("game:start", async ({ roomCode }, ack = () => {}) => {
      try {
        const room = await Room.findOne({ roomCode: roomCode?.toUpperCase() });
        if (!room || String(room.host) !== String(socket.user._id)) return ack({ error: "Only the room host can start." });
        if (room.players.length < 1) return ack({ error: "At least one investigator is required." });
        if (room.status === "completed") return ack({ error: "This game is complete." });
        room.status = "playing";
        room.timerEndsAt = new Date(Date.now() + chapterDuration(room) * 1000);
        room.eventLog.push("Investigation started. The first timeline is live.");
        await room.save();
        startTimer(io, room);
        emitRoom(io, room);
        io.to(room.roomCode).emit("game:started", { chapter: room.currentChapter, timerEndsAt: room.timerEndsAt });
        ack({ ok: true });
      } catch { ack({ error: "Could not start game." }); }
    });

    socket.on("evidence:collect", async ({ roomCode, evidenceId }, ack = () => {}) => {
      try {
        const room = await Room.findOne({ roomCode: roomCode?.toUpperCase() });
        if (!room || room.status !== "playing" || !room.players.some(p => String(p.user) === String(socket.user._id))) return ack({ error: "Game is not active." });
        const chapter = chapters[room.currentChapter - 1];
        if (!chapter.clues.some(c => c.id === evidenceId)) return ack({ error: "Evidence not available in this chapter." });
        if (!room.discoveredEvidence.includes(evidenceId)) {
          room.discoveredEvidence.push(evidenceId);
          room.eventLog.push(`${socket.user.username} discovered ${evidenceId}.`);
          await room.save();
        }
        emitRoom(io, room);
        io.to(room.roomCode).emit("game:notice", `${socket.user.username} discovered new evidence.`);
        ack({ ok: true });
      } catch { ack({ error: "Could not collect evidence." }); }
    });

    socket.on("puzzle:solve", async ({ roomCode, answer }, ack = () => {}) => {
      try {
        const room = await Room.findOne({ roomCode: roomCode?.toUpperCase() });
        if (!room || room.status !== "playing" || !room.players.some(p => String(p.user) === String(socket.user._id))) return ack({ error: "Game is not active." });
        const chapter = chapters[room.currentChapter - 1];
        if (String(answer || "").trim().toUpperCase() !== chapter.puzzle.answer.toUpperCase()) return ack({ correct: false, message: "Incorrect solution. Investigate the clues and try again." });
        const puzzleKey = `chapter-${chapter.id}-${chapter.puzzle.id}`;
        if (!room.solvedPuzzles.includes(puzzleKey)) room.solvedPuzzles.push(puzzleKey);
        room.eventLog.push(`${socket.user.username} solved ${chapter.puzzle.title}.`);
        await room.save();
        emitRoom(io, room);
        io.to(room.roomCode).emit("puzzle:solved", { puzzleId: chapter.puzzle.id, success: chapter.puzzle.success });
        ack({ correct: true, message: chapter.puzzle.success });
      } catch { ack({ error: "Could not validate puzzle." }); }
    });

    socket.on("chapter:advance", async ({ roomCode }, ack = () => {}) => {
      try {
        const room = await Room.findOne({ roomCode: roomCode?.toUpperCase() });
        if (!room || String(room.host) !== String(socket.user._id)) return ack({ error: "Only the host can advance chapters." });
        const chapter = chapters[room.currentChapter - 1];
        const puzzleKey = `chapter-${chapter.id}-${chapter.puzzle.id}`;
        const hasClues = chapter.requiredClues.every(id => room.discoveredEvidence.includes(id));
        if (!room.solvedPuzzles.includes(puzzleKey) || !hasClues) return ack({ error: "Collect all required evidence and solve the chapter puzzle first." });
        if (room.currentChapter >= 10) return ack({ error: "Use the final decision to complete the story." });
        room.currentChapter += 1;
        room.currentLoop = 1;
        room.timerEndsAt = new Date(Date.now() + chapterDuration(room) * 1000);
        room.eventLog.push(`Chapter ${room.currentChapter} unlocked.`);
        await room.save();
        startTimer(io, room);
        emitRoom(io, room);
        io.to(room.roomCode).emit("chapter:changed", { chapter: room.currentChapter, timerEndsAt: room.timerEndsAt });
        ack({ ok: true });
      } catch { ack({ error: "Could not advance chapter." }); }
    });

    socket.on("decision:cast", async ({ roomCode, option }, ack = () => {}) => {
      try {
        const room = await Room.findOne({ roomCode: roomCode?.toUpperCase() });
        if (!room || String(room.host) !== String(socket.user._id) || room.currentChapter !== 10) return ack({ error: "Only the host can finalize the Chapter 10 decision." });
        if (!["destroy", "sacrifice", "preserve"].includes(option)) return ack({ error: "Invalid ending choice." });
        const chapter = chapters[9];
        const puzzleKey = `chapter-10-${chapter.puzzle.id}`;
        if (!room.solvedPuzzles.includes(puzzleKey) || !chapter.requiredClues.every(id => room.discoveredEvidence.includes(id))) return ack({ error: "Complete the final investigation first." });
        room.ending = option === "destroy" ? "true_ending" : option === "sacrifice" ? "sacrifice_ending" : "preservation_ending";
        room.status = "completed";
        room.timerEndsAt = null;
        room.eventLog.push(`The investigators chose: ${option}.`);
        await room.save();
        if (timers.has(room.roomCode)) { clearInterval(timers.get(room.roomCode)); timers.delete(room.roomCode); }
        emitRoom(io, room);
        io.to(room.roomCode).emit("game:ended", { ending: room.ending, option });
        ack({ ok: true, ending: room.ending });
      } catch { ack({ error: "Could not finalize ending." }); }
    });

    socket.on("chat:send", async ({ roomCode, message }, ack = () => {}) => {
      const clean = String(message || "").trim().slice(0, 300);
      if (!clean) return ack({ error: "Message is empty." });
      const room = await Room.findOne({ roomCode: roomCode?.toUpperCase() });
      if (!room || !room.players.some(p => String(p.user) === String(socket.user._id))) return ack({ error: "Room access denied." });
      io.to(room.roomCode).emit("chat:message", { username: socket.user.username, message: clean, at: new Date().toISOString() });
      ack({ ok: true });
    });

    socket.on("disconnect", async () => {
      await Room.updateMany({ "players.user": socket.user._id }, { $set: { "players.$.connected": false } }).catch(() => {});
    });
  });
}
