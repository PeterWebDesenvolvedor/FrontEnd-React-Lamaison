// src/components/Usuarios/Usuarios.jsx
import React, { useState, useEffect } from "react";
import { usuarioService } from "../../services/usuarioService";
import "../Home/Home.css";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Estados do Formulário de cadastro de usuários
  const [novoNome, setNovoNome] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [novoTipo, setNovoTipo] = useState("Vendedor");

  const carregarUsuarios = async () => {
    setLoading(true);
    try {
      const res = await usuarioService.listarTodos();
      if (res.success) setUsuarios(res.data);
    } catch (error) {
      alert("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  // Função para desativar/ativar
  const handleToggleStatus = async (id, ativoAtual) => {
    if (
      !window.confirm(
        `Deseja ${ativoAtual ? "desativar" : "ativar"} este usuário?`,
      )
    )
      return;
    const res = await usuarioService.toggleStatus(id, !ativoAtual);
    if (res.success) {
      setUsuarios(
        usuarios.map((u) => (u.id === id ? { ...u, ativo: !ativoAtual } : u)),
      );
    }
  };

  const handleCadastrarUsuario = async (e) => {
    e.preventDefault();
    if (!novoNome || !novoEmail || !novaSenha) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }
    try {
      const dados = {
        name: novoNome,
        email: novoEmail,
        senha: novaSenha,
        tipo: novoTipo,
      };
      const res = await usuarioService.cadastrar(dados);
      if (res.success) {
        alert("Usuário cadastrado!");
        setShowModal(false);
        setNovoNome("");
        setNovoEmail("");
        setNovaSenha("");
        carregarUsuarios();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading && usuarios.length === 0)
    return (
      <div className="containerHome">
        <p>Carregando...</p>
      </div>
    );

  return (
    <div className="containerHome">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Usuários</h2>
        <button
          onClick={() => setShowModal(true)}
          className="btnCard"
          style={{ maxWidth: "200px" }}
        >
          + Criar Usuário
        </button>
      </div>

      <div className="cardsContainer">
        {usuarios.map((u) => (
          <div className="card" key={u.id}>
            <h3>{u.name || u.nome}</h3>
            <p>
              <strong>Email:</strong> {u.email}
            </p>
            <p>
              <strong>Tipo:</strong> {u.tipo || u.role}
            </p>
            <span
              style={{
                background: u.ativo ? "#28a745" : "#dc3545",
                color: "white",
                padding: "2px 10px",
                borderRadius: "12px",
                fontSize: "0.8rem",
                display: "inline-block",
                marginBottom: "10px",
              }}
            >
              {u.ativo ? "Ativo" : "Inativo"}
            </span>
            <br />
            <button
              onClick={() => handleToggleStatus(u.id, u.ativo)}
              className="btnCard"
              style={{
                fontSize: "0.8rem",
                padding: "5px 15px",
                maxWidth: "150px",
                margin: "0 auto",
              }}
            >
              {u.ativo ? "Desativar" : "Ativar"}
            </button>
          </div>
        ))}
      </div>

      {/* ⚡ MODAL DE CADASTRO DE USUÁRIO */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              background: "var(--bege-claro)",
              padding: "30px",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "500px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            }}
          >
            <h3
              style={{ marginBottom: "20px", color: "var(--laranja-escuro)" }}
            >
              Criar Novo Usuário
            </h3>
            <form onSubmit={handleCadastrarUsuario}>
              <div
                className="campo"
                style={{
                  marginBottom: "12px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <label>Nome Completo *</label>
                <input
                  type="text"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                  required
                />
              </div>
              <div
                className="campo"
                style={{
                  marginBottom: "12px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <label>E-mail de Login *</label>
                <input
                  type="email"
                  value={novoEmail}
                  onChange={(e) => setNovoEmail(e.target.value)}
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                  required
                />
              </div>
              <div
                className="campo"
                style={{
                  marginBottom: "12px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <label>Senha *</label>
                <input
                  type="password"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                  required
                />
              </div>
              <div
                className="campo"
                style={{
                  marginBottom: "20px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <label>Tipo do Usuário</label>
                <select
                  value={novoTipo}
                  onChange={(e) => setNovoTipo(e.target.value)}
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="Vendedor">Vendedor</option>
                  <option value="Apontador">Apontador</option>
                  <option value="Empresa">Empresa</option>
                  <option value="Representante">Representante</option>
                </select>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "10px 20px",
                    background: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btnCard"
                  style={{ maxWidth: "150px" }}
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;
