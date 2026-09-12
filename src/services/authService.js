import api from "./api";

export const authService = {
  // 🔹 Função de Login
  async login(email, senha) {
    try {
      const response = await api.post("/auth/login", { email, senha });
      const responseData = response.data.data;

      if (responseData && responseData.token) {
        const user = {
          email: responseData.email,
          role: responseData.role,
          name: responseData.email.split("@")[0],
        };

        // Mudança: Salvando em sessionStorage para expirar ao fechar o navegador/aba
        sessionStorage.setItem("authToken", responseData.token);
        sessionStorage.setItem("user", JSON.stringify(user));

        return {
          success: true,
          user: user,
          token: responseData.token,
        };
      } else {
        throw new Error("Resposta de login inválida do servidor");
      }
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || "Erro no servidor");
      } else if (error.request) {
        throw new Error(
          "Erro de conexão. Verifique se o Spring Boot está rodando.",
        );
      } else {
        throw new Error("Erro desconhecido");
      }
    }
  },

  // 🔹 Função de Cadastro
  async register(userData) {
    try {
      const response = await api.post("/usuario/criar", {
        email: userData.email,
        senha: userData.senha,
        role: userData.role || "VENDEDOR",
      });

      const responseData = response.data.data;
      if (responseData) {
        return { success: true, user: responseData };
      }
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || "Erro ao cadastrar");
      } else {
        throw new Error("Erro de conexão. Verifique sua internet.");
      }
    }
  },

  // 🔹 Função de Logout
  logout() {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");
  },

  isAuthenticated() {
    const token = sessionStorage.getItem("authToken");
    const user = sessionStorage.getItem("user");
    return !!(token && user);
  },

  getCurrentUser() {
    const user = sessionStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};
