import { create } from "zustand";
import { API } from "./authStore.js";

export const useAIStore = create((set, get) => ({
  chats:          [],
  activeChat:     null,    // full chat object with messages
  activeChatId:   null,
  isLoading:      false,
  error:          null,

  sendMessage: async (message, model) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await API.post("/ai/chat", {
        message,
        chatId: get().activeChatId || undefined,
        model,
      });

      set((s) => ({
        activeChatId: data.chatId,
        activeChat: s.activeChat
          ? {
              ...s.activeChat,
              messages: [
                ...s.activeChat.messages,
                { role: "user",      content: message },
                { role: "assistant", content: data.reply },
              ],
            }
          : null,
        isLoading: false,
      }));

      return data.reply;
    } catch (err) {
      set({ error: err.response?.data?.message || "Message failed.", isLoading: false });
    }
  },

  feedback: async (imagePath, instructions) => {
  set({ isLoading: true, error: null });
  try {
    const { data } = await API.post("/ai/feedback", {
      imagePath,
      instructions,
    });
    set({ isLoading: false });
    return data.feedback;
  } catch (err) {
    set({ error: err.response?.data?.message || "Feedback failed.", isLoading: false });
  }
},

  fetchChats: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await API.get("/ai/chats");
      set({ chats: data.chats, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to load chats.", isLoading: false });
    }
  },

  openChat: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await API.get(`/ai/chats/${id}`);
      set({ activeChat: data.chat, activeChatId: id, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to open chat.", isLoading: false });
    }
  },

  newChat: () => set({ activeChat: null, activeChatId: null }),

  deleteChat: async (id) => {
    try {
      await API.delete(`/ai/chats/${id}`);
      set((s) => ({
        chats: s.chats.filter((c) => c._id !== id),
        activeChatId: s.activeChatId === id ? null : s.activeChatId,
        activeChat:   s.activeChatId === id ? null : s.activeChat,
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || "Delete failed." });
    }
  },

  clearError: () => set({ error: null }),
}));