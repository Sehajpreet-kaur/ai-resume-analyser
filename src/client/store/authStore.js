import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });

// Attach JWT to every request automatically
API.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const useAuthStore = create(
  persist(
    (set) => ({
      user:      null,
      token:     null,
      isLoading: false,
      error:     null,

      register: async (username, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await API.post("/auth/register", { username, email, password });
          set({ isLoading: false });
        } catch (err) {
          const message = err.response?.data?.message || "Registration failed.";
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await API.post("/auth/login", { email, password });
          set({ user: data.user, token: data.token, isLoading: false });
          return data;
        } catch (err) {
          const message = err.response?.data?.message || "Login failed.";
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      logout: async () => {
        try { await API.post("/auth/logout"); } catch (_) {}
        set({ user: null, token: null });
      },

      fetchMe: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await API.get("/auth/me");
          set({ user: data.user, isLoading: false });
        } catch (err) {
          const message = err.response?.data?.message || "Failed to fetch user.";
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      updateMe: async (updates) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await API.put("/auth/me", updates);
          set({ user: data.user, isLoading: false });
        } catch (err) {
          const message = err.response?.data?.message || "Update failed.";
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      clearError: () => set({ error: null }),
    }),
    { name: "auth-storage", partialize: (s) => ({ token: s.token, user: s.user }) }
  )
);

export { API };