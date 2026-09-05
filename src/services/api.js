// src/services/api.js
import axios from 'axios';

// 🔴 IMPORTANTE: Verifique se o Java está rodando na porta 8080!
// Se estiver em outra porta (ex: 8070), troque aqui.
const API_URL = 'http://localhost:8070/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Importante para enviar e receber Cookies (seu Java usa cookies para refresh token)
});

// Interceptor para adicionar token (Seu Java usa Bearer Token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratar erros (401 - Não autorizado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;