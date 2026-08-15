// src/components/Produtos/Produtos.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { produtoService } from "../../services/produtoService";
import "../Home/Home.css";

const Produtos = () => {
  const { user } = useAuth();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // Controla o formulário

  // Estados do formulário
  const [novoNome, setNovoNome] = useState("");
  const [novoValor, setNovoValor] = useState("");
  const [novaCategoria, setNovaCategoria] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");

  // 🔹 Carrega os produtos ao abrir a tela
  const carregarProdutos = async () => {
    setLoading(true);
    try {
      const resultado = await produtoService.listarTodos();
      if (resultado.success) {
        setProdutos(resultado.data);
      }
    } catch (err) {
      alert("Erro ao carregar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  // 🔹 Função para cadastrar um novo produto
  const handleCadastrar = async (e) => {
    e.preventDefault(); // Evita recarregar a página

    if (!novoNome || !novoValor) {
      alert("Preencha pelo menos Nome e Valor!");
      return;
    }

    const novoProduto = {
      nome: novoNome,
      categoria: novaCategoria || "Geral",
      valor: parseFloat(novoValor),
      descricao: novaDescricao,
    };

    try {
      const resultado = await produtoService.cadastrar(novoProduto);
      if (resultado.success) {
        alert("Produto cadastrado com sucesso!");
        setShowModal(false); // Fecha o modal
        // Limpa os campos
        setNovoNome("");
        setNovoValor("");
        setNovaCategoria("");
        setNovaDescricao("");
        carregarProdutos(); // Recarrega a lista automaticamente
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading && produtos.length === 0)
    return (
      <div className="containerHome">
        <p>Carregando...</p>
      </div>
    );

  return (
    <div className="containerHome">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Produtos</h2>
        {user?.role === "ADMIN" && (
          <button
            onClick={() => setShowModal(true)}
            className="btnCard"
            style={{ maxWidth: "200px" }}
          >
            + Cadastrar Produto
          </button>
        )}
      </div>

      <div className="cardsContainer">
        {produtos.map((p) => (
          <div className="card" key={p.id}>
            <h3>{p.nome}</h3>
            <p>
              <strong>Categoria:</strong> {p.categoria}
            </p>
            <p style={{ color: "var(--laranja-escuro)", fontWeight: "bold" }}>
              R$ {p.valor.toLocaleString("pt-BR")}
            </p>
            <p style={{ fontSize: "0.9rem", fontStyle: "italic" }}>
              {p.descricao}
            </p>
          </div>
        ))}
      </div>

      {/* ⚡ MODAL DE CADASTRO (Formulário) */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              background: "var(--bege-claro)",
              padding: "30px",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "500px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            }}
          >
            <h3
              style={{ marginBottom: "20px", color: "var(--laranja-escuro)" }}
            >
              Cadastrar Novo Produto
            </h3>
            <form onSubmit={handleCadastrar}>
              <div
                className="campo"
                style={{
                  marginBottom: "12px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <label>Nome do Produto *</label>
                <input
                  type="text"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                  required
                />
              </div>
              <div
                className="campo"
                style={{
                  marginBottom: "12px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <label>Valor (R$) *</label>
                <input
                  type="number"
                  value={novoValor}
                  onChange={(e) => setNovoValor(e.target.value)}
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                  required
                />
              </div>
              <div
                className="campo"
                style={{
                  marginBottom: "12px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <label>Categoria</label>
                <input
                  type="text"
                  value={novaCategoria}
                  onChange={(e) => setNovaCategoria(e.target.value)}
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              <div
                className="campo"
                style={{
                  marginBottom: "20px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <label>Descrição</label>
                <textarea
                  value={novaDescricao}
                  onChange={(e) => setNovaDescricao(e.target.value)}
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    minHeight: "80px",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "10px 20px",
                    background: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btnCard"
                  style={{ maxWidth: "150px" }}
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Produtos;
