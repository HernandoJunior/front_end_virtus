import axios from "axios";

// Pega a URL da API do ambiente, com fallback para localhost
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 segundos
  withCredentials: true, // Importante para CORS com cookies/credenciais
});

// Interceptor para adicionar o token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros globais
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token expirado ou inválido
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Redireciona para login (ajuste a rota conforme seu projeto)
      window.location.href = '/login';
    }
    
    // Erro de CORS ou servidor offline
    if (!error.response) {
      console.error('Erro de conexão com a API:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Log para debug (remover em produção se necessário)
console.log('🔗 API conectada em:', baseURL);

export default api;