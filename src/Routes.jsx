// src/Routes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Login from "./components/Login/Login";
import Layout from "./components/Layout/Layout";

import Dashboard from "./components/Dashboard/Dashboard";
import Produtos from "./components/Produtos/Produtos";
import Catalogo from "./components/Catalogo/Catalogo";
import Usuarios from "./components/Usuarios/Usuarios";
import Negociacoes from "./components/Negociacoes/Negociacoes";
import Financeiro from "./components/Financeiro/Financeiro";
import MinhasComissoes from "./components/Comissoes/MinhasComissoes";
import Aprovacao from "./components/Aprovacao/Aprovacao";
import Solicitacoes from "./components/Solicitacoes/Solicitacoes";

// 🔒 Guard para rotas exclusivas de ADMIN
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (user?.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// 🔒 Guard para rotas exclusivas de VENDEDOR
const VendedorRoute = ({ children }) => {
  const { user } = useAuth();
  if (user?.role !== "VENDEDOR") {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const isAdmin = user?.role === "ADMIN";

  return (
    <Routes>
      {/* Rotas Comuns */}
      <Route
        path="/dashboard"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />
      <Route
        path="/produtos"
        element={
          <Layout>
            <Produtos />
          </Layout>
        }
      />
      <Route
        path="/catalogo"
        element={
          <Layout>
            <Catalogo />
          </Layout>
        }
      />
      <Route
        path="/negociacoes"
        element={
          <Layout>
            <Negociacoes />
          </Layout>
        }
      />

      {/* Rotas exclusivas ADMIN */}
      <Route
        path="/usuarios"
        element={
          <AdminRoute>
            <Layout>
              <Usuarios />
            </Layout>
          </AdminRoute>
        }
      />
      <Route
        path="/aprovacao"
        element={
          <AdminRoute>
            <Layout>
              <Aprovacao />
            </Layout>
          </AdminRoute>
        }
      />
      <Route
        path="/financeiro"
        element={
          <AdminRoute>
            <Layout>
              <Financeiro />
            </Layout>
          </AdminRoute>
        }
      />
      <Route
        path="/solicitacoes"
        element={
          <AdminRoute>
            <Layout>
              <Solicitacoes />
            </Layout>
          </AdminRoute>
        }
      />

      {/* Rotas exclusivas VENDEDOR */}
      <Route
        path="/minhas-comissoes"
        element={
          <VendedorRoute>
            <Layout>
              <MinhasComissoes />
            </Layout>
          </VendedorRoute>
        }
      />

      {/* Redirecionamentos */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/home" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
