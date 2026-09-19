// src/components/Layout/Layout.jsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Layout.css";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = user?.role === "ADMIN";

  // 📋 Menu base para todos
  const menuComum = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/catalogo", label: "Catálogo", icon: "🏭" },
    { path: "/produtos", label: "Produtos", icon: "📦" },
    { path: "/negociacoes", label: "Negociações", icon: "🤝" },
  ];

  // 🔑 Menu exclusivo do ADMIN
  const menuAdmin = [
    { path: "/usuarios", label: "Usuários", icon: "👥" },
    { path: "/solicitacoes", label: "Solicitações", icon: "📩" },
    { path: "/aprovacao", label: "Aprovação", icon: "✅" },
    { path: "/financeiro", label: "Financeiro", icon: "💰" },
  ];

  // 🧑‍💼 Menu exclusivo do VENDEDOR
  const menuVendedor = [
    { path: "/minhas-comissoes", label: "Minhas Comissões", icon: "💵" },
  ];

  const menuItems = isAdmin
    ? [...menuComum, ...menuAdmin]
    : [...menuComum, ...menuVendedor];

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="layout-container">
      <div className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-title">Lamaison</div>

        {/* Badge de role */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "15px",
            padding: "6px 12px",
            background: isAdmin ? "var(--laranja-escuro)" : "var(--queimado)",
            color: "white",
            borderRadius: "20px",
            fontSize: "0.75rem",
            fontWeight: "600",
            letterSpacing: "1px",
            width: "fit-content",
            margin: "0 auto 15px",
          }}
        >
          {isAdmin ? "👑 ADMIN" : "🧑‍💼 VENDEDOR"}
        </div>

        <nav>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`menu-item ${
                location.pathname === item.path ? "active" : ""
              }`}
              onClick={closeMenu}
            >
              <span>{item.icon}</span> {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ marginTop: "auto", paddingTop: "20px" }}>
          <button
            onClick={handleLogout}
            className="menu-item"
            style={{ width: "100%", textAlign: "left" }}
          >
            🚪 Sair
          </button>
        </div>
      </div>

      <div className="content-area">
        <div className="header-top">
          <button className="btn-menu-mobile" onClick={toggleMenu}>
            ☰
          </button>
          <span>👤 {user?.name || "Usuário"}</span>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Layout;
