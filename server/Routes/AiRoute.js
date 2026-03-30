import express from "express";
import { protect } from "../../controllers/AuthMiddleware.js";
import { sendMessage, getChats, getChatById, deleteChat } from "../../controllers/AiController.js";

const router = express.Router();

router.use(protect);

router.post("/chat",         sendMessage);
router.get("/chats",         getChats);
router.get("/chats/:id",     getChatById);
router.delete("/chats/:id",  deleteChat);

export default router;