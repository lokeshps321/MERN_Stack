import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:") || path.startsWith("blob:")) return path;
  return `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

export default api;
