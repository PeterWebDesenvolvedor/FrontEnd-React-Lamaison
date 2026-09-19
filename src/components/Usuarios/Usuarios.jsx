// src/components/Usuarios/Usuarios.jsx
import React, { useState, useEffect } from "react";
import { usuarioService } from "../../services/usuarioService";
import { useAuth } from "../../contexts/AuthContext";
import "../Home/Home.css";

const Usuarios = () => {
  const { user: usuarioLogado } = useAuth();

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  // 🔍 Filtros
  const [busca, setBusca] = useState("");
  const [filtroRole, setFiltroRole] = useState("TODOS");
  const [filtroStatus, setFiltroStatus] = useState("TODOS");

  // 📋 Estados do formulário
  const [novoNome, setNovoNome] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [novoRole, setNovoRole] = useState("VENDEDOR");

  // 🔹 Carregar usuários
  const carregarUsuarios = async () => {
    setLoading(true);
    try {
      const res = await usuarioService.listarTodos();
      // Aceita resposta direta ou paginada
      const lista =
        res.data?.content || res.data?.data?.content || res.data || [];
      setUsuarios(Array.isArray(lista) ? lista : []);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  // 🔹 Reset do formulário
  const resetForm = () => {
    setNovoNome("");
    setNovoEmail("");
    setNovaSenha("");
    setNovoRole("VENDEDOR");
    setModoEdicao(false);
    setUsuarioEditando(null);
  };

  // 🔹 Abrir modal de cadastro
  const abrirModalCadastro = () => {
    resetForm();
    setShowModal(true);
  };

  // 🔹 Abrir modal de edição
  const abrirModalEdicao = (u) => {
    setUsuarioEditando(u);
    setNovoNome(u.name || u.nome || "");
    setNovoEmail(u.email || "");
    setNovaSenha("");
    setNovoRole(u.role || u.tipo || "VENDEDOR");
    setModoEdicao(true);
    setShowModal(true);
  };

  // 🔹 Salvar (criar ou editar)
  const handleSalvarUsuario = async (e) => {
    e.preventDefault();

    if (!novoNome.trim() || !novoEmail.trim()) {
      alert("Preencha Nome e E-mail!");
      return;
    }

    if (!modoEdicao && !novaSenha.trim()) {
      alert("Informe uma senha para o novo usuário!");
      return;
    }

    if (novaSenha && novaSenha.length < 6) {
      alert("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    const dados = {
      name: novoNome.trim(),
      email: novoEmail.trim(),
      role: novoRole,
    };

    if (novaSenha.trim()) dados.senha = novaSenha;

    try {
      if (modoEdicao) {
        await usuarioService.atualizar(usuarioEditando.id, dados);
        alert("Usuário atualizado com sucesso!");
      } else {
        await usuarioService.cadastrar(dados);
        alert("Usuário cadastrado com sucesso!");
      }
      setShowModal(false);
      resetForm();
      carregarUsuarios();
    } catch (err) {
      alert(err.message);
    }
  };

  // 🔹 Ativar/Desativar
  const handleToggleStatus = async (u) => {
    if (String(u.id) === String(usuarioLogado?.id)) {
      alert("Você não pode desativar a si mesmo!");
      return;
    }

    if (
      !window.confirm(
        `Deseja ${u.ativo ? "desativar" : "ativar"} o usuário "${u.name || u.nome}"?`,
      )
    )
      return;

    try {
      await usuarioService.toggleStatus(u.id, !u.ativo);
      setUsuarios((prev) =>
        prev.map((item) =>
          item.id === u.id ? { ...item, ativo: !u.ativo } : item,
        ),
      );
    } catch (err) {
      alert("Erro ao alterar status: " + err.message);
    }
  };

  // 🔹 Excluir
  const handleExcluir = async (u) => {
    if (String(u.id) === String(usuarioLogado?.id)) {
      alert("Você não pode excluir a si mesmo!");
      return;
    }

    if (
      !window.confirm(
        `Excluir permanentemente o usuário "${u.name || u.nome}"?`,
      )
    )
      return;

    try {
      await usuarioService.deletar(u.id);
      alert("Usuário excluído!");
      carregarUsuarios();
    } catch (err) {
      alert("Erro ao excluir: " + err.message);
    }
  };

  // 🔍 Filtro aplicado
  const usuariosFiltrados = usuarios.filter((u) => {
    const nome = u.name || u.nome || "";
    const email = u.email || "";
    const role = u.role || u.tipo || "";

    const matchBusca =
      !busca ||
      nome.toLowerCase().includes(busca.toLowerCase()) ||
      email.toLowerCase().includes(busca.toLowerCase());

    const matchRole = filtroRole === "TODOS" || role === filtroRole;

    const matchStatus =
      filtroStatus === "TODOS" ||
      (filtroStatus === "ATIVOS" && u.ativo) ||
      (filtroStatus === "INATIVOS" && !u.ativo);

    return matchBusca && matchRole && matchStatus;
  });

  // 📊 Estatísticas
  const totalUsuarios = usuarios.length;
  const totalAdmins = usuarios.filter(
    (u) => (u.role || u.tipo) === "ADMIN",
  ).length;
  const totalVendedores = usuarios.filter(
    (u) => (u.role || u.tipo) === "VENDEDOR",
  ).length;
  const totalAtivos = usuarios.filter((u) => u.ativo).length;

  if (loading && usuarios.length === 0)
    return (
      <div className="containerHome">
        <p>Carregando usuários...</p>
      </div>
    );

  return (
    <div className="containerHome">
      {/* Cabeçalho */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div>
          <h2>Gerenciamento de Usuários</h2>
          <p style={{ fontSize: "0.9rem", color: "var(--queimado)" }}>
            Área exclusiva do administrador.
          </p>
        </div>

        <button
          onClick={abrirModalCadastro}
          className="btnCard"
          style={{ width: "fit-content", maxWidth: "220px" }}
        >
          + Criar Usuário
        </button>
      </div>

      {/* Cards de estatísticas */}
      <div
        className="cardsContainer"
        style={{
          marginBottom: "30px",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        }}
      >
        <div className="card" style={{ padding: "20px" }}>
          <div className="cardIcon">👥</div>
          <h3 style={{ fontSize: "1rem" }}>Total</h3>
          <p
            style={{
              fontSize: "1.6rem",
              fontWeight: "bold",
              color: "var(--laranja-escuro)",
            }}
          >
            {totalUsuarios}
          </p>
        </div>
        <div className="card" style={{ padding: "20px" }}>
          <div className="cardIcon">👑</div>
          <h3 style={{ fontSize: "1rem" }}>Admins</h3>
          <p
            style={{
              fontSize: "1.6rem",
              fontWeight: "bold",
              color: "var(--laranja-escuro)",
            }}
          >
            {totalAdmins}
          </p>
        </div>
        <div className="card" style={{ padding: "20px" }}>
          <div className="cardIcon">🧑‍💼</div>
          <h3 style={{ fontSize: "1rem" }}>Vendedores</h3>
          <p
            style={{
              fontSize: "1.6rem",
              fontWeight: "bold",
              color: "var(--laranja-escuro)",
            }}
          >
            {totalVendedores}
          </p>
        </div>
        <div className="card" style={{ padding: "20px" }}>
          <div className="cardIcon">✅</div>
          <h3 style={{ fontSize: "1rem" }}>Ativos</h3>
          <p
            style={{
              fontSize: "1.6rem",
              fontWeight: "bold",
              color: "#28a745",
            }}
          >
            {totalAtivos}
          </p>
        </div>
      </div>

      {/* 🔍 Filtros */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "25px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Buscar por nome ou e-mail..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{
            flex: 2,
            minWidth: "220px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid var(--glass-border)",
          }}
        />
        <select
          value={filtroRole}
          onChange={(e) => setFiltroRole(e.target.value)}
          style={{
            flex: 1,
            minWidth: "150px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid var(--glass-border)",
          }}
        >
          <option value="TODOS">Todos os cargos</option>
          <option value="ADMIN">Admin</option>
          <option value="VENDEDOR">Vendedor</option>
        </select>
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          style={{
            flex: 1,
            minWidth: "150px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid var(--glass-border)",
          }}
        >
          <option value="TODOS">Todos os status</option>
          <option value="ATIVOS">Ativos</option>
          <option value="INATIVOS">Inativos</option>
        </select>
      </div>

      {/* 📋 Lista de usuários */}
      <div className="cardsContainer">
        {usuariosFiltrados.length === 0 ? (
          <p style={{ color: "var(--queimado)" }}>
            Nenhum usuário encontrado com os filtros aplicados.
          </p>
        ) : (
          usuariosFiltrados.map((u) => {
            const role = u.role || u.tipo || "VENDEDOR";
            const isAdmin = role === "ADMIN";
            const ehMesmoUsuario = String(u.id) === String(usuarioLogado?.id);

            return (
              <div className="card" key={u.id}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      background: isAdmin
                        ? "var(--laranja-escuro)"
                        : "var(--queimado)",
                      color: "white",
                      padding: "3px 10px",
                      borderRadius: "12px",
                      fontSize: "0.7rem",
                      fontWeight: "600",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {isAdmin ? "👑 ADMIN" : "🧑‍💼 VENDEDOR"}
                  </div>

                  {ehMesmoUsuario && (
                    <span
                      style={{
                        fontSize: "0.7rem",
                        color: "var(--laranja-escuro)",
                        fontWeight: "600",
                      }}
                    >
                      (você)
                    </span>
                  )}
                </div>

                <h3>{u.name || u.nome}</h3>
                <p style={{ fontSize: "0.9rem", wordBreak: "break-all" }}>
                  📧 {u.email}
                </p>

                <span
                  style={{
                    background: u.ativo ? "#28a745" : "#dc3545",
                    color: "white",
                    padding: "3px 12px",
                    borderRadius: "12px",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    display: "inline-block",
                    marginTop: "10px",
                    marginBottom: "15px",
                  }}
                >
                  {u.ativo ? "● Ativo" : "○ Inativo"}
                </span>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={() => abrirModalEdicao(u)}
                    className="btnCard"
                    style={{
                      fontSize: "0.8rem",
                      padding: "6px 14px",
                      background: "#17a2b8",
                    }}
                  >
                    ✏️ Editar
                  </button>

                  <button
                    onClick={() => handleToggleStatus(u)}
                    className="btnCard"
                    disabled={ehMesmoUsuario}
                    style={{
                      fontSize: "0.8rem",
                      padding: "6px 14px",
                      background: u.ativo ? "#ffc107" : "#28a745",
                      color: u.ativo ? "#333" : "white",
                      opacity: ehMesmoUsuario ? 0.5 : 1,
                      cursor: ehMesmoUsuario ? "not-allowed" : "pointer",
                    }}
                  >
                    {u.ativo ? "⏸️ Desativar" : "▶️ Ativar"}
                  </button>

                  <button
                    onClick={() => handleExcluir(u)}
                    className="btnCard"
                    disabled={ehMesmoUsuario}
                    style={{
                      fontSize: "0.8rem",
                      padding: "6px 14px",
                      background: "#dc3545",
                      opacity: ehMesmoUsuario ? 0.5 : 1,
                      cursor: ehMesmoUsuario ? "not-allowed" : "pointer",
                    }}
                  >
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ⚡ MODAL DE CADASTRO / EDIÇÃO */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
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
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            }}
          >
            <h3
              style={{
                marginBottom: "20px",
                color: "var(--laranja-escuro)",
              }}
            >
              {modoEdicao ? "✏️ Editar Usuário" : "➕ Criar Novo Usuário"}
            </h3>

            <form onSubmit={handleSalvarUsuario}>
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
                <label>
                  {modoEdicao
                    ? "Nova Senha (deixe em branco para manter)"
                    : "Senha *"}
                </label>
                <input
                  type="password"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                  required={!modoEdicao}
                  minLength={6}
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
                <label>Cargo *</label>
                <select
                  value={novoRole}
                  onChange={(e) => setNovoRole(e.target.value)}
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="VENDEDOR">🧑‍💼 Vendedor</option>
                  <option value="ADMIN">👑 Administrador</option>
                </select>

                <small
                  style={{
                    marginTop: "6px",
                    fontSize: "0.8rem",
                    color: "var(--queimado)",
                    fontStyle: "italic",
                  }}
                >
                  {novoRole === "ADMIN"
                    ? "Acesso total: gerencia usuários, financeiro e aprovações."
                    : "Pode cadastrar produtos, negociar e ver suas comissões."}
                </small>
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
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  style={{
                    padding: "10px 20px",
                    background: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btnCard"
                  style={{ maxWidth: "150px" }}
                >
                  {modoEdicao ? "Salvar Alterações" : "Criar Usuário"}
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
