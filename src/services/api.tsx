import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080'
});

// Interceptor para adicionar o token
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('@virtus:user');
    if (user) {
      const userData = JSON.parse(user);
      if (userData.token) {
        config.headers.Authorization = `Bearer ${userData.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na API:', error);
    
    if (error.response?.status === 401) {
      // Token expirado, redirecionar para login
      localStorage.removeItem('@virtus:user');
      window.location.href = '/';
    }
    
    return Promise.reject(error);
  }
);

export { api };