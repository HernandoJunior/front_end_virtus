import axios from "axios";

// Pega a URL da API do ambiente, com fallback para localhost
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const api = axios.create({
  baseURL,
  timeout: 30000, // 30 segundos
  withCredentials: true, // Importante para CORS com cookies/credenciais
});


export default api;