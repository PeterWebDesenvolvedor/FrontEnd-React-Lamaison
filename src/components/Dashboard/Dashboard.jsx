import React from "react";
import { useAuth } from "../../contexts/AuthContext";
// import "../Home/Home.css"; // Reutilizando seu CSS

const Dashboard = () => {
  const { user } = useAuth();

  // Dados falsos para teste
  const stats = [
    { label: "Usuários Ativos", value: "12", icon: "👤" },
    { label: "Produtos", value: "45", icon: "📦" },
    { label: "Negociações Ativas", value: "8", icon: "🤝" },
    { label: "Vendas", value: "R$ 320k", icon: "💰" },
  ];

  return (
    <div className="containerHome">
      <div className="welcomeSection">
        <h2>Bem-vindo, {user?.name}!</h2>
        <p>Resumo do seu sistema Lamaison.</p>
      </div>

      <div className="cardsContainer">
        {stats.map((stat, index) => (
          <div className="card" key={index}>
            <div className="cardIcon">{stat.icon}</div>
            <h3>{stat.label}</h3>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--laranja-escuro)" }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;