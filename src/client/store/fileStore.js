import { create } from "zustand";
import { API } from "./authStore.js";

export const useFileStore = create((set) => ({
  files:     [],
  isLoading: false,
  error:     null,

  read: async (fileUrl) => {
    try {
      const response = await API.get(fileUrl, {
        responseType: "arraybuffer",
      });
      return new Blob([response.data], { type: response.headers['content-type'] });
    } catch (err) {
      set({ error: err.response?.data?.message || "Read failed." });
      return null;
    }
  },

  upload: async (file) => {
    set({ isLoading: true, error: null });
    try {
      const form = new FormData();
      form.append("file", file);
      const { data } = await API.post("/files/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((s) => ({ files: [data.file, ...s.files], isLoading: false }));
      return data.file;
    } catch (err) {
      set({ error: err.response?.data?.message || "Upload failed.", isLoading: false });
    }
  },

  fetchMyFiles: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await API.get("/files");
      set({ files: data.files, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to fetch files.", isLoading: false });
    }
  },

  deleteFile: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await API.delete(`/files/${id}`);
      set((s) => ({ files: s.files.filter((f) => f._id !== id), isLoading: false }));
    } catch (err) {
      set({ error: err.response?.data?.message || "Delete failed.", isLoading: false });
    }
  },

  toggleVisibility: async (id) => {
    try {
      const { data } = await API.patch(`/files/${id}/visibility`);
      set((s) => ({ files: s.files.map((f) => (f._id === id ? data.file : f)) }));
    } catch (err) {
      set({ error: err.response?.data?.message || "Update failed." });
    }
  },

  clearError: () => set({ error: null }),
}));