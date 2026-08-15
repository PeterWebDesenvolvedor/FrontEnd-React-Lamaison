// src/services/usuarioService.js
import api from './api';

export const usuarioService = {
  
  // 🔹 Listar Usuários (GET)
  async listarTodos() {
    try {
      const response = await api.get('/usuarios');
      return { success: true, data: response.data };
    } catch (error) {
      throw new Error('Erro ao carregar usuários');
    }
  },

  // 🔹 Cadastrar Usuário (POST) - Admin cria os outros
  async cadastrar(dados) {
    try {
      const response = await api.post('/usuarios', dados);
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Erro ao criar usuário');
      }
      throw new Error('Erro de conexão');
    }
  },

  // 🔹 Ativar/Desativar Usuário (PATCH ou PUT)
  async toggleStatus(id, ativo) {
    try {
      const response = await api.patch(`/usuarios/${id}`, { ativo });
      return { success: true, data: response.data };
    } catch (error) {
      throw new Error('Erro ao alterar status');
    }
  }
};