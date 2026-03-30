import express from "express";
import { register, login, logout, getMe, updateMe } from "../../controllers/authController.js";
import { protect } from "../../controllers/AuthMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login",    login);
router.post("/logout",   protect, logout);
router.get("/me",        protect, getMe);
router.put("/me",        protect, updateMe);

export default router;