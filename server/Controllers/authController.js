import jwt from "jsonwebtoken";
import User from "../Models/User.js"
import Session from "../Models/SessionModel.js"

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: "Username, email, and password are required." });
  const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ message: "Email or username already taken." });

    const user = await User.create({ username, email, password });
    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required." });
    console.log("Login attempt for email:", email);

    const user = await User.findOne({ email }).select("+password");
    console.log("User found:", user);        // ← add this
    console.log("Password in DB:", user?.password); // ← add this
    const passwordMatch = await user.comparePassword(password);
    console.log("Password match:", passwordMatch); // ← add this
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "Invalid credentials." });

    const token = signToken(user._id);

    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/logout  (requires auth middleware)
export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      const decoded = jwt.decode(token);
      await Session.create({
        token,
        userId: req.user._id,
        expiresAt: new Date(decoded.exp * 1000),
      });
    }
    res.json({ message: "Logged out successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me  (requires auth middleware)
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/auth/me  (requires auth middleware)
export const updateMe = async (req, res) => {
  try {
    const { username, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username, avatar },
      { new: true, runValidators: true }
    );
    res.json({ user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};