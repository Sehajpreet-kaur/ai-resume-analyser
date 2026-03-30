import { create } from "zustand";
import { API } from "./authStore.js";

export const useKVStore = create((set) => ({
  records:   {},   // { [key]: value }
  isLoading: false,
  error:     null,

  get: async (key) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await API.get(`/kv/${key}`);
      set((s) => ({ records: { ...s.records, [data.key]: data.value }, isLoading: false }));
      return data.value;
    } catch (err) {
      set({ error: err.response?.data?.message || "Key not found.", isLoading: false });
    }
  },

  set: async (key, value, ttlSeconds) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await API.put(`/kv/${key}`, { value, ttlSeconds });
      set((s) => ({ records: { ...s.records, [data.key]: data.value }, isLoading: false }));
    } catch (err) {
      set({ error: err.response?.data?.message || "Set failed.", isLoading: false });
    }
  },

  delete: async (key) => {
    try {
      await API.delete(`/kv/${key}`);
      set((s) => {
        const next = { ...s.records };
        delete next[key];
        return { records: next };
      });
    } catch (err) {
      set({ error: err.response?.data?.message || "Delete failed." });
    }
  },

  list: async (prefix = "") => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await API.get("/kv", { params: prefix ? { prefix } : {} });
      const map = Object.fromEntries(data.records.map((r) => [r.key, r.value]));
      set({ records: map, isLoading: false });
      return data.records;
    } catch (err) {
      set({ error: err.response?.data?.message || "List failed.", isLoading: false });
    }
  },

  flush: async () => {
    try {
      await API.delete("/kv");
      set({ records: {} });
    } catch (err) {
      set({ error: err.response?.data?.message || "Flush failed." });
    }
  },

  clearError: () => set({ error: null }),
}));