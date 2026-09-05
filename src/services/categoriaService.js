import api from "./api"; // Ajuste o caminho do seu axios configurado

export const categoriaService = {
  // 🔹 Novo: Lista todas as categorias cadastradas no Java (Tipo de Produto)
  listarCategorias: async () => {
    try {
      // Ajuste para o endpoint GET do seu controller Java de TipoProduto (ex: /tipo-produto)
      const response = await api.get("/tipo-produto");

      // Trata caso venha paginado ou como lista simples
      const dados =
        response.data.data?.content || response.data.data || response.data;

      return {
        success: true,
        data: Array.isArray(dados) ? dados : [],
      };
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Erro ao buscar categorias.",
      );
    }
  },

  // Passo 1: Salva o Tipo de Produto (Categoria) e retorna os dados (com o ID gerado)
  cadastrarTipoProduto: async (nomeCategoria) => {
    try {
      const response = await api.post("/tipo-produto", { nome: nomeCategoria });

      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Erro ao cadastrar categoria.",
      );
    }
  },

  // Passo 2: Salva um campo individual associado ao ID da categoria criada
  adicionarCampoAoTipoProduto: async (dadosCampo) => {
    try {
      const response = await api.post("/campo-tipo-produto", dadosCampo);

      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Erro ao cadastrar campo personalizado.",
      );
    }
  },
};
