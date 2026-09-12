import api from "./api";

export const categoriaService = {
  // Lista todas as categorias cadastradas
  listarCategorias: async () => {
    try {
      const response = await api.get("/tipo-produto");
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

  // Passo 1: Salva o Tipo de Produto (Categoria)
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

  // Passo 2: Salva a LISTA de campos associada ao ID da categoria criada
  adicionarCamposEmLoteAoTipoProduto: async (tipoProdutoId, listaCampos) => {
    try {
      // Mapeia a lista adicionando o tipoProdutoId em cada item se o seu backend esperar uma lista de objetos com ID
      const payload = listaCampos.map((campo) => ({
        nome: campo.nome,
        tipoCampo: campo.tipoCampo,
        tipoProdutoId: tipoProdutoId,
      }));

      // Endpoint que recebe uma Lista (ajuste a rota caso necessário no Java, ex: /campo-tipo-produto/lote)
      const response = await api.post("/campo-tipo-produto", payload);

      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Erro ao cadastrar campos personalizados em lote.",
      );
    }
  },
};
