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

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/produtos", label: "Produtos", icon: "📦" },
    { path: "/usuarios", label: "Usuários", icon: "👥" },
    { path: "/negociacoes", label: "Negociações", icon: "🤝" },
    { path: "/financeiro", label: "Financeiro", icon: "💰" },
    { path: "/aprovacao", label: "Aprovação", icon: "✅" },
  ];

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="layout-container">
      {/* Menu Lateral */}
      <div className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-title">Lamaison</div>
        <nav>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`menu-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={closeMenu}
            >
              <span>{item.icon}</span> {item.label}
            </Link>
          ))}
        </nav>
        <div style={{ marginTop: "auto", paddingTop: "20px" }}>
          <button onClick={handleLogout} className="menu-item" style={{ width: "100%", textAlign: "left" }}>
            🚪 Sair
          </button>
        </div>
      </div>

      {/* Área de Conteúdo */}
      <div className="content-area">
        <div className="header-top">
          <button className="btn-menu-mobile" onClick={toggleMenu}>☰</button>
          <span>👤 {user?.name || "Usuário"}</span>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Layout;