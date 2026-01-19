// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  withCredentials: true, // CRUCIAL: Envia cookies automaticamente
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Interceptor de resposta para renovação automática
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se não for erro 401 ou já tentou renovar, rejeita
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Se já está renovando, adiciona à fila
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => api(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Tenta renovar o token (cookies são enviados automaticamente)
      await api.post('/auth/refresh');

      processQueue(null);
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as Error);

      // Redireciona para login
      window.location.href = '/';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export { api };