import React, { useState, useEffect } from "react";
import "./ProdutoForm.css";

const ProdutoForm = ({ produtoInicial, categoriasDisponiveis, onSalvar }) => {
  const [nome, setNome] = useState(produtoInicial?.nome || "");
  const [preco, setPreco] = useState(produtoInicial?.preco || "");
  const [categoriaSelecionadaId, setCategoriaSelecionadaId] = useState(
    produtoInicial?.categoriaId || "",
  );
  const [camposDinamicos, setCamposDinamicos] = useState(
    produtoInicial?.camposDinamicos || {},
  );
  const [camposDaCategoria, setCamposDaCategoria] = useState([]);

  useEffect(() => {
    if (!categoriaSelecionadaId) {
      setCamposDaCategoria([]);
      return;
    }
    const categoriaObj = categoriasDisponiveis.find(
      (cat) => String(cat.id) === String(categoriaSelecionadaId),
    );
    setCamposDaCategoria(categoriaObj?.camposConfigurados || []);
  }, [categoriaSelecionadaId, categoriasDisponiveis]);

  const handleCampoDinamicoChange = (nomeCampo, valor) => {
    setCamposDinamicos((prev) => ({ ...prev, [nomeCampo]: valor }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSalvar({
      nome,
      preco,
      categoriaId: categoriaSelecionadaId,
      camposDinamicos,
    });
  };

  return (
    <div className="produto-form-container">
      <h2>{produtoInicial ? "Editar Produto" : "Novo Produto"}</h2>

      <form onSubmit={handleSubmit}>
        <div className="campo">
          <label>Nome do Produto</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
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

        {camposDaCategoria.length > 0 && (
          <div className="secao-campos-dinamicos">
            <h3>Atributos da Categoria</h3>
            {camposDaCategoria.map((campo, index) => {
              const ehImagem =
                campo.tipo === "file" ||
                campo.nome.toLowerCase().includes("imagem");

              return (
                <div className="campo" key={index}>
                  <label>{campo.nome}</label>
                  {ehImagem ? (
                    <div className="input-imagem-container">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleCampoDinamicoChange(
                            campo.nome,
                            e.target.files[0],
                          )
                        }
                      />
                      {camposDinamicos[campo.nome] && (
                        <span className="arquivo-selecionado">
                          Arquivo selecionado:{" "}
                          {camposDinamicos[campo.nome].name}
                        </span>
                      )}
                    </div>
                  ) : (
                    <input
                      type={campo.tipo || "text"}
                      value={camposDinamicos[campo.nome] || ""}
                      onChange={(e) =>
                        handleCampoDinamicoChange(campo.nome, e.target.value)
                      }
                      placeholder={`Digite ${campo.nome.toLowerCase()}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        <button type="submit" className="btnSalvarProduto">
          Salvar Produto
        </button>
      </form>
    </div>
  );
};

export default ProdutoForm;
