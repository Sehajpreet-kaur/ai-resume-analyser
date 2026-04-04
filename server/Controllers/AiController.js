// controllers/AI/AIController.js

import Chat from "../Models/ChatModel.js";
import groq from "../utils/groqClient.js";  
import fs from "fs";
import path from "path";

// POST /api/ai/chat  — start or continue a conversation
export const sendMessage = async (req, res) => {
  try {
    const { message, chatId, model = "llama3-8b-8192" } = req.body;
    //                                  ↑ ✅ Step 4 change: Groq free model name
    
    if (!message) return res.status(400).json({ message: "Message is required." });

    let chat;
    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, owner: req.user._id });
      if (!chat) return res.status(404).json({ message: "Chat not found." });
    } else {
      chat = await Chat.create({ owner: req.user._id, model, messages: [] });
    }

    chat.messages.push({ role: "user", content: message });

    const history = chat.messages.map((m) => ({
      role: m.role === "system" ? "user" : m.role,
      content: m.content,
    }));

    // ✅ Step 4: replaced anthropic.messages.create → groq.chat.completions.create
    const response = await groq.chat.completions.create({
      model: chat.model,
      max_tokens: 1024,
      messages: history,
    });

    // ✅ Groq response shape is different from Anthropic
    const assistantText = response.choices[0].message.content;

    chat.messages.push({ role: "assistant", content: assistantText });

    // ✅ Groq token usage fields
    chat.tokenUsage.input  += response.usage.prompt_tokens;
    chat.tokenUsage.output += response.usage.completion_tokens;

    if (chat.messages.length === 2) chat.title = message.slice(0, 60);
    await chat.save();

    res.json({ chatId: chat._id, reply: assistantText, usage: response.usage });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/ai/chats
export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ owner: req.user._id })
      .select("title model tokenUsage createdAt updatedAt")
      .sort({ updatedAt: -1 });
    res.json({ chats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/ai/chats/:id
export const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, owner: req.user._id });
    if (!chat) return res.status(404).json({ message: "Chat not found." });
    res.json({ chat });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/ai/chats/:id
export const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!chat) return res.status(404).json({ message: "Chat not found." });
    res.json({ message: "Chat deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/ai/feedback — analyze resume image
export const analyzeFeedback = async (req, res) => {
  try {
    const { imagePath, instructions } = req.body;

    if (!imagePath || !instructions)
      return res.status(400).json({ message: "imagePath and instructions are required." });

    const relativePath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
    const absolutePath = path.resolve(relativePath);

    if (!fs.existsSync(absolutePath))
      return res.status(404).json({ message: "File not found: " + absolutePath });

    const base64Image = fs.readFileSync(absolutePath).toString("base64");

    const response = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct", 
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:image/png;base64,${base64Image}`,
              },
            },
            {
              type: "text",
              text: instructions,
            },
          ],
        },
      ],
    });

    const text = response.choices[0].message.content;
    res.json({ feedback: text });
  } catch (err) {
    console.error("AI Feedback Error:", err);
    res.status(500).json({ message: err.message });
  }
};