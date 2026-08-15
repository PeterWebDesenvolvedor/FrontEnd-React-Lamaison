// src/components/Login/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [nome, setNome] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [localError, setLocalError] = useState("");
  const { login, register, loading, error } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!email || !senha) {
      setLocalError("Preencha todos os campos");
      return;
    }

    const result = await login(email, senha);
    if (!result.success) {
      setLocalError(result.error || "Erro ao fazer login");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!nome || !email || !senha || !confirmarSenha) {
      setLocalError("Preencha todos os campos");
      return;
    }

    if (senha !== confirmarSenha) {
      setLocalError("As senhas não coincidem");
      return;
    }

    if (senha.length < 6) {
      setLocalError("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    const result = await register({ name: nome, email, senha });
    if (result.success) {
      alert("Cadastro realizado com sucesso! Faça login para continuar.");
      setIsRegistering(false);
      setNome("");
      setSenha("");
      setConfirmarSenha("");
    } else {
      setLocalError(result.error || "Erro ao cadastrar");
    }
  };

  return (
    <div className="containerLogin">
      <div className="formLogin">
        <div className="titulo">
          <h1>Lamaison</h1>
          <h2>{isRegistering ? "Crie sua conta" : "Entre com os dados"}</h2>
        </div>

        {(error || localError) && (
          <div className="errorMessage show">{error || localError}</div>
        )}

        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          {isRegistering && (
            <div className="campo">
              <label>Nome completo</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite seu nome"
                required
                disabled={loading}
              />
            </div>
          )}

          <div className="campo">
            <label>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              required
              disabled={loading}
            />
          </div>

          <div className="campo">
            <label>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              required
              disabled={loading}
            />
          </div>

          {isRegistering && (
            <div className="campo">
              <label>Confirmar senha</label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Confirme sua senha"
                required
                disabled={loading}
              />
            </div>
          )}

          <div className="botaoContainer">
            <button type="submit" className="btnEntrar" disabled={loading}>
              {loading
                ? "Carregando..."
                : isRegistering
                  ? "Cadastrar"
                  : "Entrar"}
            </button>
          </div>
        </form>

        <div className="toggleContainer">
          {/* <button
            type="button"
            className="btnToggle"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setLocalError("");
            }}
            disabled={loading}
          >
            {isRegistering
              ? "Já tenho uma conta. Fazer login"
              : "Não tenho uma conta. Cadastrar"}
          </button> */}
        </div>

        {!isRegistering && (
          <div className="infoUsuario">
            {/* <p>
              Usuário teste: <strong>usuario@teste.com</strong>
            </p>
            <p>
              Senha: <strong>123456</strong>
            </p> */}

            {/* BOTÃO DE TESTE RÁPIDO */}
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  // Cria um usuário falso no navegador
                  // const fakeUser = {
                  //   id: 1,
                  //   name: "Usuário Teste",
                  //   email: "teste@teste.com",
                  //   role: "USER",
                  // };

                  const fakeUser = {
                    id: 1,
                    name: "Admin Lamaison", // Nome do Admin
                    email: "admin@lamaison.com",
                    role: "ADMIN", // Isso é CRUCIAL para liberar as telas de Admin
                  };
                  const fakeToken = "token-falso-123456";

                  localStorage.setItem("authToken", fakeToken);
                  localStorage.setItem("user", JSON.stringify(fakeUser));

                  alert(
                    "Usuário criado no LocalStorage! Recarregue a página e clique em Entrar.",
                  );
                  window.location.reload(); // Recarrega para aplicar
                }}
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "10px 15px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                🔧 Criar Usuário Fake (Login Rápido)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
