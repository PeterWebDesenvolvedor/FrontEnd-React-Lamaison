// src/services/negociacaoService.js
import api from './api';

export const negociacaoService = {
  
  async listarTodas() {
    try {
      const response = await api.get('/negociacoes');
      return { success: true, data: response.data };
    } catch (error) {
      throw new Error('Erro ao carregar negociações');
    }
  },

  async criar(dados) {
    try {
      const response = await api.post('/negociacoes', dados);
      return { success: true, data: response.data };
    } catch (error) {
      throw new Error('Erro ao criar negociação');
    }
  }
};