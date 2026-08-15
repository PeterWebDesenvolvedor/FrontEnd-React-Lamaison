import React from "react";
// import "../Home/Home.css";

const Financeiro = () => {
  // Regra: Venda de R$ 100.000,00. Base = 5% (R$ 5.000,00)
  // 50% (Apontador) = R$ 2.500, 30% (Vendedor) = R$ 1.500, 20% (Dono do produto) = R$ 1.000
  const comissoes = [
    { usuario: "João (Vendedor)", valor: 1500, tipo: "30%" },
    { usuario: "Empresa ABC (Dono)", valor: 1000, tipo: "20%" },
    { usuario: "Maria (Apontadora)", valor: 2500, tipo: "50%" },
  ];

  return (
    <div className="containerHome">
      <h2>Financeiro & Comissões</h2>
      <p style={{ marginBottom: "20px", color: "var(--queimado)" }}>
        * As comissões são calculadas em cima de 5% do valor da venda.
      </p>
      <div className="cardsContainer">
        {comissoes.map((c, i) => (
          <div className="card" key={i}>
            <h3>{c.usuario}</h3>
            <p style={{ fontSize: "1.8rem", fontWeight: "bold", color: "var(--laranja-escuro)" }}>
              R$ {c.valor.toLocaleString("pt-BR")}
            </p>
            <p>Comissão: {c.tipo}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Financeiro;