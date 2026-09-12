import React, { useState, useEffect } from "react";
import "./ProdutoForm.css";

const ProdutoForm = ({ produtoInicial, categoriasDisponiveis, onSalvar }) => {
  // Estado básico do produto
  const [nome, setNome] = useState(produtoInicial?.nome || "");
  const [preco, setPreco] = useState(produtoInicial?.preco || "");
  const [categoriaSelecionadaId, setCategoriaSelecionadaId] = useState(produtoInicial?.categoriaId || "");
  
  // Armazena os valores dos campos dinâmicos da categoria escolhida
  // Exemplo: { [nomeDoCampo]: valor }
  const [camposDinamicos, setCamposDinamicos] = useState(produtoInicial?.camposDinamicos || {});

  // Lista de campos dinâmicos pertencentes à categoria atualmente selecionada
  const [camposDaCategoria, setCamposDaCategoria] = useState([]);

  // Toda vez que a categoria mudar, descobrimos quais campos ela possui configurados
  useEffect(() => {
    if (!categoriaSelecionadaId) {
      setCamposDaCategoria([]);
      return;
    }

    // Busca a categoria selecionada na lista de categorias disponíveis
    const categoriaObj = categoriasDisponiveis.find(
      (cat) => cat.id === Number(categoriaSelecionadaId)
    );

    if (categoriaObj && categoriaObj.camposConfigurados) {
      // Exemplo esperado: categoriaObj.camposConfigurados = [ { nome: 'Imagem', tipo: 'file' }, { nome: 'Tamanho', tipo: 'text' } ]
      setCamposDaCategoria(categoriaObj.camposConfigurados);
    } else {
      setCamposDaCategoria([]);
    }
  }, [categoriaSelecionadaId, categoriasDisponiveis]);

  // Atualiza o valor de um campo dinâmico específico preenchido pelo usuário
  const handleCampoDinamicoChange = (nomeCampo, valor) => {
    setCamposDinamicos((prev) => ({
      ...prev,
      [nomeCampo]: valor,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dadosProduto = {
      nome,
      preco,
      categoriaId: categoriaSelecionadaId,
      camposDinamicos, // Envia os dados personalizados configurados pela categoria
    };
    onSalvar(dadosProduto);
  };

  return (
    <div className="produto-form-container">
      <h2>{produtoInicial ? "Editar Produto" : "Novo Produto"}</h2>

      <form onSubmit={handleSubmit}>
        {/* Campos Padrão do Produto */}
        <div className="campo">
          <label>Nome do Produto</label>
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        </div>

        <div className="campo">
          <label>Preço (R$)</label>
          <input
            type="number"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
          />
        </div>

        {/* Seleção de Categoria */}
        <div className="campo">
          <label>Categoria</label>
          <select
            value={categoriaSelecionadaId}
            onChange={(e) => setCategoriaSelecionadaId(e.target.value)}
            required
          >
            <option value="">Selecione uma categoria...</option>
            {categoriasDisponiveis.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>
        </div>

        {/* ========================================== */}
        {/* RENDERIZAÇÃO DINÂMICA DOS CAMPOS DA CATEGORIA */}
        {/* ========================================== */}
        {camposDaCategoria.length > 0 && (
          <div className="secao-campos-dinamicos">
            <h3>Atributos da Categoria</h3>
            
            {camposDaCategoria.map((campo, index) => {
              // Verificamos se o campo configurado é do tipo imagem/arquivo ou texto
              const ehImagem = campo.tipo === 'file' || campo.nome.toLowerCase().includes('imagem');

              return (
                <div className="campo" key={index}>
                  <label>{campo.nome}</label>

                  {ehImagem ? (
                    <div className="input-imagem-container">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const arquivo = e.target.files[0];
                          // Você pode salvar o arquivo ou a URL gerada
                          handleCampoDinamicoChange(campo.nome, arquivo);
                        }}
                      />
                      {camposDinamicos[campo.nome] && (
                        <span className="arquivo-selecionado">
                          Arquivo selecionado: {camposDinamicos[campo.nome].name}
                        </span>
                      )}
                    </div>
                  ) : (
                    <input
                      type={campo.tipo || "text"}
                      value={camposDinamicos[campo.nome] || ""}
                      onChange={(e) => handleCampoDinamicoChange(campo.nome, e.target.value)}
                      placeholder={`Digite ${campo.nome.toLowerCase()}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        <button type="submit" className="btnSalvarProduto">Salvar Produto</button>
      </form>
    </div>
  );
};

export default ProdutoForm;