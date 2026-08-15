import React from "react";
// import "../Home/Home.css";

const Aprovacao = () => {
  const pendentes = [
    { id: 1, nome: "Guindaste 40T", usuario: "João Vendedor", data: "01/08/2026" },
    { id: 2, nome: "Esteira Transportadora", usuario: "Empresa XYZ", data: "02/08/2026" },
  ];

  return (
    <div className="containerHome">
      <h2>Aprovação de Produtos</h2>
      <p style={{ color: "var(--queimado)", marginBottom: "20px" }}>Aguardando sua análise para liberar no sistema.</p>

      <div className="cardsContainer">
        {pendentes.map((p) => (
          <div className="card" key={p.id}>
            <h3>{p.nome}</h3>
            <p><strong>Cadastrado por:</strong> {p.usuario}</p>
            <p><strong>Data:</strong> {p.data}</p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "15px" }}>
              <button className="btnCard" style={{ background: "#28a745" }}>✅ Aprovar</button>
              <button className="btnCard" style={{ background: "#dc3545" }}>❌ Recusar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Aprovacao;