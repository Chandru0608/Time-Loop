import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken } from "../utils/token.js";
import { auth } from "../middleware/auth.js";
const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username?.trim() || !email?.trim() || !password) return res.status(400).json({ message: "All fields are required." });
    if (username.trim().length < 3) return res.status(400).json({ message: "Username must be at least 3 characters." });
    if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters." });
    const normalized = email.trim().toLowerCase();
    if (await User.findOne({ email: normalized })) return res.status(409).json({ message: "Email already registered." });
    const user = await User.create({ username: username.trim(), email: normalized, password: await bcrypt.hash(password, 12) });
    res.status(201).json({ token: signToken(user), user: { id: user._id, username: user.username, email: user.email } });
  } catch (e) { res.status(500).json({ message: "Registration failed." }); }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.trim().toLowerCase() }).select("+password");
    if (!user || !await bcrypt.compare(password || "", user.password)) return res.status(401).json({ message: "Invalid email or password." });
    res.json({ token: signToken(user), user: { id: user._id, username: user.username, email: user.email } });
  } catch { res.status(500).json({ message: "Login failed." }); }
});

router.get("/me", auth, (req, res) => res.json({ user: { id: req.user._id, username: req.user.username, email: req.user.email } }));
export default router;
