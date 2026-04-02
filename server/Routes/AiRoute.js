import express from "express";
import { protect } from "../Controllers/AuthMiddleware.js"
import { sendMessage, getChats, getChatById, deleteChat } from "../Controllers/AiController.js"

const router = express.Router();

router.use(protect);

router.post("/chat",         sendMessage);
router.get("/chats",         getChats);
router.get("/chats/:id",     getChatById);
router.delete("/chats/:id",  deleteChat);

export default router;