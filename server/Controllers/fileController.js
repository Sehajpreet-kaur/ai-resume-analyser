import path from "path";
import fs from "fs";
import File from "../Models/File.js";

// POST /api/files/upload  (multer puts file on req.file)
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file provided." });

    const record = await File.create({
      owner: req.user._id,
      originalName: req.file.originalname,
      storedName: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      url: `/uploads/${req.file.filename}`,
    });

    res.status(201).json({ file: record });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/files  — list caller's files
export const getMyFiles = async (req, res) => {
  try {
    const files = await File.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json({ files });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/files/:id
export const getFileById = async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, owner: req.user._id });
    if (!file) return res.status(404).json({ message: "File not found." });
    res.json({ file });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/files/:id
export const deleteFile = async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, owner: req.user._id });
    if (!file) return res.status(404).json({ message: "File not found." });

    // Remove physical file
    const filePath = path.resolve(file.path);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await file.deleteOne();
    res.json({ message: "File deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/files/:id/visibility
export const toggleVisibility = async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, owner: req.user._id });
    if (!file) return res.status(404).json({ message: "File not found." });
    file.isPublic = !file.isPublic;
    await file.save();
    res.json({ file });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};