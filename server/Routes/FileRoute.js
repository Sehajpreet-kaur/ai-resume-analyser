import express from "express";
import multer from "multer";
import path from "path";
import { protect } from "../Controllers/AuthMiddleware.js";
import {
  uploadFile,
  getMyFiles,
  getFileById,
  deleteFile,
  toggleVisibility,
} from "../Controllers/fileController.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename:    (req, file, cb) =>
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|pdf|txt|doc|docx|csv|json/;
    const ext = path.extname(file.originalname).toLowerCase();
    allowed.test(ext) ? cb(null, true) : cb(new Error("File type not allowed."));
  },
});

const router = express.Router();

router.use(protect);

router.post("/upload",              upload.single("file"), uploadFile);
router.get("/",                     getMyFiles);
router.get("/:id",                  getFileById);
router.delete("/:id",               deleteFile);
router.patch("/:id/visibility",     toggleVisibility);

export default router;