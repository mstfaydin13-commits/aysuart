import axios from "axios";

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const TOKEN_KEY = "aysu_admin_token";

export const tokenStore = {
  get() { return localStorage.getItem(TOKEN_KEY); },
  set(t) { localStorage.setItem(TOKEN_KEY, t); },
  clear() { localStorage.removeItem(TOKEN_KEY); },
};

export const api = axios.create({ baseURL: API });

api.interceptors.request.use((config) => {
  const t = tokenStore.get();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

export const fileUrl = (fileId) => `${API}/files/${fileId}`;
