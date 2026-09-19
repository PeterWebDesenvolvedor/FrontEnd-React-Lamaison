// src/components/Comissoes/MinhasComissoes.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import "../Home/Home.css";

const MinhasComissoes = () => {
  const { user } = useAuth();
  const [comissoes, setComissoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todas");

  useEffect(() => {
    const carregar = async () => {
      try {
        // Endpoint que retorna comissões do usuário logado
        const res = await api.get(`/comissoes/usuario/${user?.id}`);
        setComissoes(res.data.data || res.data || []);
      } catch (err) {
        // Fallback com dados mockados para desenvolvimento
        setComissoes([
          {
            id: 1,
            descricao: "Venda Guindaste 40T",
            tipo: "VENDA",
            percentual: 30,
            valor: 1500,
            status: "PAGA",
            data: "2026-08-01",
          },
          {
            id: 2,
            descricao: "Indicação Empresa XYZ",
            tipo: "INDICACAO",
            percentual: 20,
            valor: 1000,
            status: "PENDENTE",
            data: "2026-08-05",
          },
          {
            id: 3,
            descricao: "Máquina trazida - Esteira",
            tipo: "MAQUINA_TRAZIDA",
            percentual: 50,
            valor: 2500,
            status: "PAGA",
            data: "2026-07-20",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) carregar();
  }, [user?.id]);

  const filtradas =
    filtro === "todas"
      ? comissoes
      : comissoes.filter((c) => c.status === filtro.toUpperCase());

  const totalPago = comissoes
    .filter((c) => c.status === "PAGA")
    .reduce((acc, c) => acc + c.valor, 0);
  const totalPendente = comissoes
    .filter((c) => c.status === "PENDENTE")
    .reduce((acc, c) => acc + c.valor, 0);

  if (loading)
    return (
      <div className="containerHome">
        <p>Carregando comissões...</p>
      </div>
    );

  return (
    <div className="containerHome">
      <h2>Minhas Comissões</h2>
      <p style={{ color: "var(--queimado)", marginBottom: "20px" }}>
        Acompanhe seus ganhos por venda, indicação ou máquina trazida.
      </p>

      {/* Cards resumo */}
      <div className="cardsContainer" style={{ marginBottom: "30px" }}>
        <div className="card">
          <div className="cardIcon">💰</div>
          <h3>Total Pago</h3>
          <p
            style={{
              fontSize: "1.6rem",
              fontWeight: "bold",
              color: "#28a745",
            }}
          >
            R$ {totalPago.toLocaleString("pt-BR")}
          </p>
        </div>
        <div className="card">
          <div className="cardIcon">⏳</div>
          <h3>Pendente</h3>
          <p
            style={{
              fontSize: "1.6rem",
              fontWeight: "bold",
              color: "var(--laranja-escuro)",
            }}
          >
            R$ {totalPendente.toLocaleString("pt-BR")}
          </p>
        </div>
      </div>

      {/* Filtro */}
      <div style={{ marginBottom: "20px" }}>
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid var(--glass-border)",
            minWidth: "200px",
          }}
        >
          <option value="todas">Todas</option>
          <option value="paga">Pagas</option>
          <option value="pendente">Pendentes</option>
        </select>
      </div>

      {/* Lista detalhada */}
      <div className="cardsContainer">
        {filtradas.length === 0 ? (
          <p style={{ color: "var(--queimado)" }}>
            Nenhuma comissão encontrada.
          </p>
        ) : (
          filtradas.map((c) => (
            <div className="card" key={c.id}>
              <h3>{c.descricao}</h3>
              <p>
                <strong>Tipo:</strong>{" "}
                {c.tipo === "VENDA"
                  ? "🛒 Venda"
                  : c.tipo === "INDICACAO"
                    ? "👥 Indicação"
                    : "🏭 Máquina trazida"}
              </p>
              <p>
                <strong>Percentual:</strong> {c.percentual}%
              </p>
              <p
                style={{
                  fontSize: "1.4rem",
                  fontWeight: "bold",
                  color: "var(--laranja-escuro)",
                }}
              >
                R$ {c.valor.toLocaleString("pt-BR")}
              </p>
              <span
                style={{
                  background: c.status === "PAGA" ? "#28a745" : "#ffc107",
                  color: c.status === "PAGA" ? "white" : "#333",
                  padding: "4px 12px",
                  borderRadius: "12px",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                  display: "inline-block",
                  marginTop: "8px",
                }}
              >
                {c.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MinhasComissoes;
