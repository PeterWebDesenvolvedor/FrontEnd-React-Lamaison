// src/components/Solicitacoes/Solicitacoes.jsx
import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "../Home/Home.css";

function Solicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      try {
        const res = await api.get("/solicitacoes");
        setSolicitacoes(res.data.data || res.data || []);
      } catch {
        // Mock
        setSolicitacoes([
          {
            id: 1,
            tipo: "EXCLUSAO_PRODUTO",
            produto: "Guindaste 40T",
            solicitante: "João Vendedor",
            motivo: "Produto descontinuado",
            data: "2026-08-10",
            status: "PENDENTE",
          },
          {
            id: 2,
            tipo: "INTERESSE_PRODUTO",
            produto: "Esteira Transportadora",
            solicitante: "Maria Vendedora",
            motivo: "Cliente quer comprar 2 unidades",
            data: "2026-08-11",
            status: "PENDENTE",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, []);

  const handleResolver = async (id, aprovado) => {
    const acao = aprovado ? "aprovar" : "recusar";
    if (!window.confirm(`Deseja ${acao} esta solicitação?`)) return;

    try {
      await api.patch(`/solicitacoes/${id}`, {
        status: aprovado ? "APROVADA" : "RECUSADA",
      });
      setSolicitacoes((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, status: aprovado ? "APROVADA" : "RECUSADA" }
            : s,
        ),
      );
      alert(`Solicitação ${aprovado ? "aprovada" : "recusada"}!`);
    } catch (err) {
      alert("Erro ao processar: " + err.message);
    }
  };

  if (loading)
    return (
      <div className="containerHome">
        <p>Carregando...</p>
      </div>
    );

  return (
    <div className="containerHome">
      <h2>Solicitações</h2>
      <p style={{ color: "var(--queimado)", marginBottom: "20px" }}>
        Aprovações de exclusão de produtos e interesses de compra.
      </p>

      <div className="cardsContainer">
        {solicitacoes.length === 0 ? (
          <p style={{ color: "var(--queimado)" }}>
            Nenhuma solicitação pendente.
          </p>
        ) : (
          solicitacoes.map((s) => (
            <div className="card" key={s.id}>
              <span
                style={{
                  background:
                    s.tipo === "EXCLUSAO_PRODUTO" ? "#dc3545" : "#17a2b8",
                  color: "white",
                  padding: "3px 10px",
                  borderRadius: "12px",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  display: "inline-block",
                  marginBottom: "10px",
                }}
              >
                {s.tipo === "EXCLUSAO_PRODUTO" ? "🗑️ Exclusão" : "💡 Interesse"}
              </span>
              <h3>{s.produto}</h3>
              <p>
                <strong>Solicitante:</strong> {s.solicitante}
              </p>
              <p>
                <strong>Motivo:</strong> {s.motivo}
              </p>
              <p>
                <strong>Data:</strong> {s.data}
              </p>

              {s.status === "PENDENTE" ? (
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "center",
                    marginTop: "15px",
                  }}
                >
                  <button
                    className="btnCard"
                    style={{ background: "#28a745" }}
                    onClick={() => handleResolver(s.id, true)}
                  >
                    ✅ Aprovar
                  </button>
                  <button
                    className="btnCard"
                    style={{ background: "#dc3545" }}
                    onClick={() => handleResolver(s.id, false)}
                  >
                    ❌ Recusar
                  </button>
                </div>
              ) : (
                <span
                  style={{
                    background: s.status === "APROVADA" ? "#28a745" : "#6c757d",
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: "12px",
                    fontSize: "0.8rem",
                    display: "inline-block",
                    marginTop: "10px",
                  }}
                >
                  {s.status}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Solicitacoes;
