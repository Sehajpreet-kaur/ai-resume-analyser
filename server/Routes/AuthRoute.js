import express from "express";
import { register, login, logout, getMe, updateMe } from "../Controllers/authController.js"
import { protect } from "../Controllers/AuthMiddleware.js"

const router = express.Router();

router.post("/register", register);
router.post("/login",    login);
router.post("/logout",   protect, logout);
router.get("/me",        protect, getMe);
router.put("/me",        protect, updateMe);

export default router;