// src/components/Catalogo/Catalogo.jsx
import React, { useState, useEffect } from "react";
import { produtoService } from "../../services/produtoService";
import { negociacaoService } from "../../services/negociacaoService";
import { useAuth } from "../../contexts/AuthContext";
import "../Home/Home.css";

const Catalogo = () => {
  const { user } = useAuth();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    const carregar = async () => {
      try {
        const res = await produtoService.listarTodos();
        if (res.success) setProdutos(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, []);

  // Categorias únicas para filtro
  const categorias = [
    ...new Set(
      produtos.map((p) => p.categoriaNome || p.categoria).filter(Boolean),
    ),
  ];

  const produtosFiltrados = produtos.filter((p) => {
    const matchBusca =
      !busca ||
      p.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      p.descricao?.toLowerCase().includes(busca.toLowerCase());
    const matchCategoria =
      !categoriaFiltro || (p.categoriaNome || p.categoria) === categoriaFiltro;
    return matchBusca && matchCategoria;
  });

  // 💡 Demonstra interesse — NOTIFICA O ADMIN (não o dono)
  const handleDemonstrarInteresse = async () => {
    if (!produtoSelecionado) return;

    try {
      const dados = {
        produtoId: produtoSelecionado.id,
        produtoNome: produtoSelecionado.nome,
        interessadoId: user?.id,
        interessadoNome: user?.name,
        interessadoEmail: user?.email,
        tipo: "INTERESSE_PRODUTO",
        mensagem:
          mensagem || `Tenho interesse no produto ${produtoSelecionado.nome}`,
        status: "PENDENTE",
        // ⚠️ O backend deve rotear isso para o ADMIN
        destino: "ADMIN",
      };

      await negociacaoService.criar(dados);
      alert(
        "✅ Interesse registrado! O administrador foi notificado e entrará em contato.",
      );
      setProdutoSelecionado(null);
      setMensagem("");
    } catch (err) {
      alert("Erro ao registrar interesse: " + err.message);
    }
  };

  if (loading)
    return (
      <div className="containerHome">
        <p>Carregando catálogo...</p>
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
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <h2>Catálogo de Máquinas</h2>
        <span style={{ color: "var(--queimado)", fontSize: "0.9rem" }}>
          {produtosFiltrados.length} produto(s) disponível(is)
        </span>
      </div>

      {/* Filtros */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "25px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Buscar por nome ou descrição..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{
            flex: 2,
            minWidth: "200px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid var(--glass-border)",
          }}
        />
        <select
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
          style={{
            flex: 1,
            minWidth: "180px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid var(--glass-border)",
          }}
        >
          <option value="">Todas as categorias</option>
          {categorias.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {produtosFiltrados.length === 0 ? (
        <p style={{ color: "var(--queimado)" }}>
          Nenhum produto encontrado no catálogo.
        </p>
      ) : (
        <div className="cardsContainer">
          {produtosFiltrados.map((p) => (
            <div className="card" key={p.id}>
              <div className="cardIcon">🏭</div>
              <h3>{p.nome}</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--queimado)" }}>
                {p.categoriaNome || p.categoria || "Sem categoria"}
              </p>
              <p
                style={{
                  fontSize: "1.4rem",
                  fontWeight: "bold",
                  color: "var(--laranja-escuro)",
                  margin: "10px 0",
                }}
              >
                R$ {p.valor?.toLocaleString("pt-BR")}
              </p>
              {p.descricao && (
                <p style={{ fontSize: "0.9rem", fontStyle: "italic" }}>
                  {p.descricao}
                </p>
              )}
              <button
                className="btnCard"
                style={{ marginTop: "15px" }}
                onClick={() => setProdutoSelecionado(p)}
              >
                💡 Tenho Interesse
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Interesse */}
      {produtoSelecionado && (
        <div
          style={{
            position: "fixed",
            inset: 0,
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
              style={{ color: "var(--laranja-escuro)", marginBottom: "15px" }}
            >
              Demonstrar Interesse
            </h3>
            <p style={{ marginBottom: "15px" }}>
              Produto: <strong>{produtoSelecionado.nome}</strong>
            </p>
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--queimado)",
                marginBottom: "15px",
                fontStyle: "italic",
              }}
            >
              ⚠️ O administrador será notificado e fará a intermediação.
            </p>

            <textarea
              placeholder="Deixe uma mensagem (opcional)..."
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              style={{
                width: "100%",
                minHeight: "100px",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid var(--glass-border)",
                marginBottom: "20px",
                fontFamily: "inherit",
              }}
            />

            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => {
                  setProdutoSelecionado(null);
                  setMensagem("");
                }}
                style={{
                  padding: "10px 20px",
                  background: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleDemonstrarInteresse}
                className="btnCard"
                style={{ maxWidth: "200px" }}
              >
                Enviar Interesse
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalogo;
