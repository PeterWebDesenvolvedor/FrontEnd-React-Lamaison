// src/services/authService.js
import api from './api';

export const authService = {
  
  // 🔹 Função de Login
  async login(email, senha) {
    try {
      // Seu Java espera { "email": "...", "senha": "..." }
      const response = await api.post('/auth/login', { email, senha });

      // 🔴 Adaptação importante:
      // O Java retorna { message: "...", data: { email, token, role } }
      const responseData = response.data.data;

      if (responseData && responseData.token) {
        
        // Montamos o objeto "user" do jeito que o React espera
        const user = {
          email: responseData.email,
          role: responseData.role,
          // Adicione o nome se o Java passar. Se não, usamos o email.
          name: responseData.email.split('@')[0] 
        };

        // Salva no LocalStorage
        localStorage.setItem('authToken', responseData.token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return {
          success: true,
          user: user,
          token: responseData.token
        };
      } else {
        throw new Error('Resposta de login inválida do servidor');
      }

    } catch (error) {
      if (error.response) {
        // Se o Java responder com erro 400 ou 401, ele manda um JSON:
        // { "message": "E-mail ou senha inválidos" }
        throw new Error(error.response.data.message || 'Erro no servidor');
      } else if (error.request) {
        throw new Error('Erro de conexão. Verifique se o Spring Boot está rodando.');
      } else {
        throw new Error('Erro desconhecido');
      }
    }
  },

  // 🔹 Função de Cadastro
  async register(userData) {
    try {
      // O seu Java espera: { email, senha, role } via /usuario/criar
      // (Lembre-se: 'role' deve ser "ADMIN" ou "VENDEDOR" em maiúsculas)
      const response = await api.post('/usuario/criar', {
        email: userData.email,
        senha: userData.senha,
        role: userData.role || "VENDEDOR" // Se não mandar role, vira VENDEDOR
      });

      const responseData = response.data.data;
      if (responseData) {
        return { success: true, user: responseData };
      }
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Erro ao cadastrar');
      } else {
        throw new Error('Erro de conexão. Verifique sua internet.');
      }
    }
  },

  // 🔹 Função de Logout
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    // Opcional: Chamar o /auth/logout do Java para limpar os cookies
    // api.post('/auth/logout'); 
  },

  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};