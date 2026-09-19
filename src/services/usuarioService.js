// src/services/usuarioService.js
import api from "./api";

export const usuarioService = {
  // 🔹 Listar usuários
  async listarTodos() {
    try {
      const response = await api.get("/usuario");
      return { success: true, data: response.data };
    } catch (error) {
      throw new Error("Erro ao carregar usuários");
    }
  },

  // 🔹 Cadastrar novo usuário
  async cadastrar(dados) {
    try {
      const response = await api.post("/usuario/criar", {
        name: dados.name,
        email: dados.email,
        senha: dados.senha,
        role: dados.role || "VENDEDOR",
      });
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || "Erro ao criar usuário");
      }
      throw new Error("Erro de conexão");
    }
  },

  // 🔹 Atualizar usuário
  async atualizar(id, dados) {
    try {
      const response = await api.put(`/usuario/${id}`, dados);
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      if (error.response) {
        throw new Error(
          error.response.data.message || "Erro ao atualizar usuário",
        );
      }
      throw new Error("Erro de conexão");
    }
  },

  // 🔹 Ativar/Desativar
  async toggleStatus(id, ativo) {
    try {
      const response = await api.patch(`/usuario/${id}`, { ativo });
      return { success: true, data: response.data.data || response.data };
    } catch (error) {
      throw new Error("Erro ao alterar status");
    }
  },

  // 🔹 Excluir
  async deletar(id) {
    try {
      await api.delete(`/usuario/${id}`);
      return { success: true };
    } catch (error) {
      throw new Error("Erro ao excluir usuário");
    }
  },
};
