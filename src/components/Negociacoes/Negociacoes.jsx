// src/components/Negociacoes/Negociacoes.jsx
import React, { useState, useEffect } from "react";
import { negociacaoService } from "../../services/negociacaoService";
import "../Home/Home.css";

const Negociacoes = () => {
  const [negociacoes, setNegociacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarNegociacoes = async () => {
      try {
        const resultado = await negociacaoService.listarTodas();
        if (resultado.success) {
          setNegociacoes(resultado.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    carregarNegociacoes();
  }, []);

  if (loading) return <div className="containerHome"><p>Carregando negociações...</p></div>;

  return (
    <div className="containerHome">
      <h2>Negociações</h2>
      <div className="cardsContainer">
        {negociacoes.length === 0 ? (
          <p style={{color: 'var(--queimado)'}}>Nenhuma negociação encontrada.</p>
        ) : (
          negociacoes.map((n) => (
            <div className="card" key={n.id}>
              <h3>{n.produto}</h3>
              <p><strong>Vendedor:</strong> {n.vendedor}</p>
              <p><strong>Comprador:</strong> {n.comprador}</p>
              <span style={{ 
                background: n.status === "Ativa" ? "var(--laranja-escuro)" : "#28a745",
                color: "white", padding: "2px 10px", borderRadius: "12px", display: "inline-block", marginTop: "10px"
              }}>
                {n.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Negociacoes;