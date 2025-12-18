import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL|| "https://collaborative-task-manager-backend-q30s.onrender.com/api",
  withCredentials: true
});

export default api;
