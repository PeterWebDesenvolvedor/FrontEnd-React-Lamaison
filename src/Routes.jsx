// src/Routes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Login from "./components/Login/Login";
import Layout from "./components/Layout/Layout";

// Importe as telas (vamos criar agora)
import Dashboard from "./components/Dashboard/Dashboard";
import Produtos from "./components/Produtos/Produtos";
import Usuarios from "./components/Usuarios/Usuarios";
import Negociacoes from "./components/Negociacoes/Negociacoes";
import Financeiro from "./components/Financeiro/Financeiro";
import Aprovacao from "./components/Aprovacao/Aprovacao";

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      {/* Telas que usam o Layout */}
      <Route element={<Layout><Dashboard /></Layout>} path="/dashboard" />
      <Route element={<Layout><Produtos /></Layout>} path="/produtos" />
      <Route element={<Layout><Usuarios /></Layout>} path="/usuarios" />
      <Route element={<Layout><Negociacoes /></Layout>} path="/negociacoes" />
      <Route element={<Layout><Financeiro /></Layout>} path="/financeiro" />
      <Route element={<Layout><Aprovacao /></Layout>} path="/aprovacao" />
      
      {/* Redirecionamentos */}
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/home" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default AppRoutes;