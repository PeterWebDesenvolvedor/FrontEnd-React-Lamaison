// src/services/produtoService.js
import api from './api';

export const produtoService = {
  
  // 🔹 Listar Produtos
  async listarTodos() {
    try {
      // Seu Java retorna: { message, data: { content: [ ... ] } } (Formato de página)
      const response = await api.get('/produto');
      
      // Adaptação: Pegamos o array de dentro de 'content'
      const produtos = response.data.data.content || response.data.data || [];
      
      return { success: true, data: produtos };
    } catch (error) {
      throw new Error('Erro ao carregar produtos');
    }
  },

  // 🔹 Cadastrar Produto
  async cadastrar(dados) {
    try {
      // O Java espera: { nome, descricao, preco, sku, estoque, tipoProdutoId }
      // (tipoProdutoId é o UUID do Tipo de Produto)
      const response = await api.post('/produto', dados);
      return { success: true, data: response.data.data };
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Erro ao cadastrar');
      }
      throw new Error('Erro de conexão');
    }
  },

  // 🔹 Excluir Produto (Desativa no seu Java)
  async deletar(id) {
    try {
      await api.delete(`/produto/${id}`);
      return { success: true };
    } catch (error) {
      throw new Error('Erro ao excluir produto');
    }
  }
};