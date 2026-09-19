// src/services/solicitacaoService.js
import api from "./api";

export const solicitacaoService = {
  async listarTodas() {
    try {
      const res = await api.get("/solicitacoes");
      return { success: true, data: res.data.data || res.data };
    } catch (err) {
      throw new Error("Erro ao listar solicitações");
    }
  },

  async criar(dados) {
    try {
      const res = await api.post("/solicitacoes", dados);
      return { success: true, data: res.data.data || res.data };
    } catch (err) {
      if (err.response) {
        throw new Error(
          err.response.data.message || "Erro ao criar solicitação",
        );
      }
      throw new Error("Erro de conexão");
    }
  },

  async resolver(id, aprovado) {
    try {
      const res = await api.patch(`/solicitacoes/${id}`, {
        status: aprovado ? "APROVADA" : "RECUSADA",
      });
      return { success: true, data: res.data.data || res.data };
    } catch (err) {
      throw new Error("Erro ao resolver solicitação");
    }
  },
};
