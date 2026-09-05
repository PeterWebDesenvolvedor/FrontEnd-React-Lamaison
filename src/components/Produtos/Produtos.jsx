import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { produtoService } from "../../services/produtoService";
import { categoriaService } from "../../services/categoriaService";
import "../Home/Home.css";

const Produtos = () => {
  const { user } = useAuth();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estados dos Modais
  const [showModalCadastrar, setShowModalCadastrar] = useState(false); 
  const [showModalCategoria, setShowModalCategoria] = useState(false);

  // Estados para o fluxo em 2 etapas do Modal de Categoria
  const [etapaCategoria, setEtapaCategoria] = useState(1);
  const [nomeNovaCategoria, setNomeNovaCategoria] = useState("");
  const [categoriaCriadaId, setCategoriaCriadaId] = useState(null);

  // Estados globais de categorias salvas no BD
  const [categoriasSalvas, setCategoriasSalvas] = useState([]);

  // Estados do formulário de Produto
  const [novoNome, setNovoNome] = useState("");
  const [novoValor, setNovoValor] = useState("");
  const [novaCategoriaId, setNovaCategoriaId] = useState(""); // Guarda o ID da categoria selecionada
  const [camposDinamicosProduto, setCamposDinamicosProduto] = useState([]); // Campos da categoria escolhida
  const [valoresCamposDinamicos, setValoresCamposDinamicos] = useState({}); // Respostas preenchidas pelo usuário
  const [novaDescricao, setNovoDescricao] = useState("");

  // Estados para gerenciar os campos no Modal de Categoria (Passo 2)
  const [nomeCampoInput, setNomeCampoInput] = useState("");
  const [tipoCampoInput, setTipoCampoInput] = useState("TEXTO");
  const [listaCamposPersonalizados, setListaCamposPersonalizados] = useState([]);

  // 🔹 Carregar produtos e categorias do banco
  const carregarDadosIniciais = async () => {
    setLoading(true);
    try {
      const resProdutos = await produtoService.listarTodos();
      if (resProdutos.success) setProdutos(resProdutos.data);

      const resCategorias = await categoriaService.listarCategorias();
      if (resCategorias.success) setCategoriasSalvas(resCategorias.data);
    } catch (err) {
      alert("Erro ao carregar dados: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  // 🔹 Quando o usuário seleciona uma categoria no cadastro de produto
  const handleSelecionarCategoriaProduto = (e) => {
    const idSelecionado = e.target.value;
    setNovaCategoriaId(idSelecionado);
    setValoresCamposDinamicos({}); // Reseta os valores preenchidos

    if (!idSelecionado) {
      setCamposDinamicosProduto([]);
      return;
    }

    // Busca a categoria selecionada na lista para extrair os campos dela
    const catEncontrada = categoriasSalvas.find((c) => c.id === idSelecionado);
    
    // Se o seu DTO Java já traz a lista de campos dentro da categoria (ex: catEncontrada.campos), 
    // nós populamos aqui. Caso venham por outra rota, você pode ajustar.
    setCamposDinamicosProduto(catEncontrada?.campos || []);
  };

  // Atualiza os valores digitados dinamicamente nos campos personalizados do produto
  const handleValorCampoDinamicoChange = (nomeCampo, valor) => {
    setValoresCamposDinamicos((prev) => ({
      ...prev,
      [nomeCampo]: valor,
    }));
  };

  // 🔹 Função para cadastrar o produto com os campos dinâmicos preenchidos
  const handleCadastrarProduto = async (e) => {
    e.preventDefault();

    if (!novoNome || !novoValor || !novaCategoriaId) {
      alert("Preencha Nome, Valor e selecione uma Categoria!");
      return;
    }

    const novoProduto = {
      nome: novoNome,
      valor: parseFloat(novoValor),
      tipoProdutoId: novaCategoriaId, // UUID da categoria
      descricao: novaDescricao,
      atributosDinamicos: valoresCamposDinamicos, // Objeto contendo os valores preenchidos
    };

    try {
      const resultado = await produtoService.cadastrar(novoProduto);
      if (resultado.success) {
        alert("Produto cadastrado com sucesso!");
        setShowModalCadastrar(false);
        setNovoNome("");
        setNovoValor("");
        setNovaCategoriaId("");
        setCamposDinamicosProduto([]);
        setValoresCamposDinamicos({});
        setNovoDescricao("");
        carregarDadosIniciais();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // 🔹 PASSO 1: Salva o nome da categoria e avança para configurar os campos
  const handleAvancarParaConfiguracao = async (e) => {
    e.preventDefault();

    if (!nomeNovaCategoria.trim()) {
      alert("Preencha o nome da categoria!");
      return;
    }

    try {
      setLoading(true);
      const resultado = await categoriaService.cadastrarTipoProduto(nomeNovaCategoria);
      const idGerado = resultado.data?.id; 

      if (!idGerado) throw new Error("ID da categoria não retornado pelo servidor.");

      setCategoriaCriadaId(idGerado);
      setEtapaCategoria(2);
    } catch (err) {
      alert("Erro ao cadastrar categoria: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdicionarCampoNaLista = (e) => {
    e.preventDefault();
    if (!nomeCampoInput.trim()) return;

    setListaCamposPersonalizados([
      ...listaCamposPersonalizados,
      { nome: nomeCampoInput, tipoCampo: tipoCampoInput },
    ]);
    setNomeCampoInput("");
    setTipoCampoInput("TEXTO");
  };

  const handleRemoverCampoTemp = (index) => {
    setListaCamposPersonalizados(listaCamposPersonalizados.filter((_, i) => i !== index));
  };

  // 🔹 PASSO 2: Salva os campos criados um a um
  const handleFinalizarCadastroCampos = async () => {
    try {
      setLoading(true);

      if (listaCamposPersonalizados.length > 0) {
        const promessas = listaCamposPersonalizados.map((campo) =>
          categoriaService.adicionarCampoAoTipoProduto({
            nome: campo.nome,
            tipoCampo: campo.tipoCampo,
            tipoProdutoId: categoriaCriadaId,
          })
        );
        await Promise.all(promessas);
      }

      alert("Categoria e campos configurados com sucesso!");
      fecharModalCategoriaCompleto();
      carregarDadosIniciais();
    } catch (err) {
      alert("Erro ao salvar os campos: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fecharModalCategoriaCompleto = () => {
    setShowModalCategoria(false);
    setEtapaCategoria(1);
    setNomeNovaCategoria("");
    setCategoriaCriadaId(null);
    setListaCamposPersonalizados([]);
  };

  if (loading && produtos.length === 0)
    return <div className="containerHome"><p>Carregando...</p></div>;

  return (
    <div className="containerHome">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Produtos</h2>

        {user?.role === "ADMIN" && (
          <div className="btnProdutos" style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => { setEtapaCategoria(1); setShowModalCategoria(true); }} className="btnCard" style={{ width: "fit-content", maxWidth: "200px" }}>
              + Categoria
            </button>
            <button onClick={() => setShowModalCadastrar(true)} className="btnCard" style={{ maxWidth: "200px", width: "fit-content" }}>
              + Cadastrar Produto
            </button>
          </div>
        )}
      </div>

      <div className="cardsContainer">
        {produtos.map((p) => (
          <div className="card" key={p.id}>
            <h3>{p.nome}</h3>
            <p><strong>Categoria:</strong> {p.categoriaNome || p.categoria}</p>
            <p style={{ color: "var(--laranja-escuro)", fontWeight: "bold" }}>
              R$ {p.valor?.toLocaleString("pt-BR")}
            </p>
            <p style={{ fontSize: "0.9rem", fontStyle: "italic" }}>{p.descricao}</p>
          </div>
        ))}
      </div>

      {/* ⚡ MODAL DE CADASTRO DE PRODUTO COM SELECT E CAMPOS DINÂMICOS */}
      {showModalCadastrar && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000 }}>
          <div style={{ background: "var(--bege-claro)", padding: "30px", borderRadius: "12px", width: "90%", maxWidth: "550px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
            <h3 style={{ marginBottom: "20px", color: "var(--laranja-escuro)" }}>Cadastrar Novo Produto</h3>
            
            <form onSubmit={handleCadastrarProduto}>
              <div className="campo" style={{ marginBottom: "12px", display: "flex", flexDirection: "column" }}>
                <label>Nome do Produto *</label>
                <input type="text" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} required />
              </div>

              <div className="campo" style={{ marginBottom: "12px", display: "flex", flexDirection: "column" }}>
                <label>Valor (R$) *</label>
                <input type="number" step="0.01" value={novoValor} onChange={(e) => setNovoValor(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} required />
              </div>

              {/* 📌 SELECT DE CATEGORIAS VINDU DO BANCO */}
              <div className="campo" style={{ marginBottom: "15px", display: "flex", flexDirection: "column" }}>
                <label>Categoria *</label>
                <select 
                  value={novaCategoriaId} 
                  onChange={handleSelecionarCategoriaProduto} 
                  style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} 
                  required
                >
                  <option value="">Selecione uma categoria...</option>
                  {categoriasSalvas.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* ⚡ RENDERIZAÇÃO DINÂMICA DOS CAMPOS CONFIGURADOS PARA A CATEGORIA */}
              {camposDinamicosProduto.length > 0 && (
                <div style={{ background: "#fff", padding: "15px", borderRadius: "8px", border: "1px solid #ddd", marginBottom: "15px" }}>
                  <p style={{ fontWeight: "bold", fontSize: "0.9rem", marginBottom: "10px", color: "var(--laranja-escuro)" }}>
                    Campos específicos da categoria:
                  </p>
                  
                  {camposDinamicosProduto.map((campo, index) => (
                    <div key={index} style={{ marginBottom: "10px", display: "flex", flexDirection: "column" }}>
                      <label style={{ fontSize: "0.85rem" }}>{campo.nome} ({campo.tipoCampo})</label>
                      
                      {campo.tipoCampo === "BOOLEAN" ? (
                        <select 
                          value={valoresCamposDinamicos[campo.nome] || ""} 
                          onChange={(e) => handleValorCampoDinamicoChange(campo.nome, e.target.value)}
                          style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                        >
                          <option value="">Selecione...</option>
                          <option value="true">Sim</option>
                          <option value="false">Não</option>
                        </select>
                      ) : campo.tipoCampo === "NUMERO" ? (
                        <input 
                          type="number" 
                          value={valoresCamposDinamicos[campo.nome] || ""} 
                          onChange={(e) => handleValorCampoDinamicoChange(campo.nome, e.target.value)}
                          style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                        />
                      ) : campo.tipoCampo === "DATA" ? (
                        <input 
                          type="date" 
                          value={valoresCamposDinamicos[campo.nome] || ""} 
                          onChange={(e) => handleValorCampoDinamicoChange(campo.nome, e.target.value)}
                          style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                        />
                      ) : (
                        <input 
                          type="text" 
                          value={valoresCamposDinamicos[campo.nome] || ""} 
                          onChange={(e) => handleValorCampoDinamicoChange(campo.nome, e.target.value)}
                          style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="campo" style={{ marginBottom: "20px", display: "flex", flexDirection: "column" }}>
                <label>Descrição</label>
                <textarea value={novaDescricao} onChange={(e) => setNovoDescricao(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc", minHeight: "80px" }} />
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setShowModalCadastrar(false)} style={{ padding: "10px 20px", background: "#6c757d", color: "white", border: "none", borderRadius: "6px" }}>Cancelar</button>
                <button type="submit" className="btnCard" style={{ maxWidth: "200px" }}>Salvar Produto</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CATEGORIA EM 2 ETAPAS (Mantido conforme solicitado antes) */}
      {showModalCategoria && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000 }}>
          <div style={{ background: "var(--bege-claro)", padding: "30px", borderRadius: "12px", width: "90%", maxWidth: "550px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
            
            {etapaCategoria === 1 && (
              <>
                <h3 style={{ marginBottom: "10px", color: "var(--laranja-escuro)" }}>Passo 1: Nome da Categoria</h3>
                <form onSubmit={handleAvancarParaConfiguracao}>
                  <div className="campo" style={{ marginBottom: "20px", display: "flex", flexDirection: "column" }}>
                    <label>Nome da Categoria *</label>
                    <input type="text" value={nomeNovaCategoria} onChange={(e) => setNomeNovaCategoria(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }} required />
                  </div>
                  <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                    <button type="button" onClick={fecharModalCategoriaCompleto} style={{ padding: "10px 20px", background: "#6c757d", color: "white", border: "none", borderRadius: "6px" }}>Cancelar</button>
                    <button type="submit" className="btnCard" style={{ maxWidth: "200px" }} disabled={loading}>Avançar para Campos ➡️</button>
                  </div>
                </form>
              </>
            )}

            {etapaCategoria === 2 && (
              <>
                <h3 style={{ marginBottom: "5px", color: "var(--laranja-escuro)" }}>Passo 2: Configurar Campos</h3>
                <p style={{ fontSize: "0.85rem", color: "#555", marginBottom: "15px" }}>Categoria: <strong>{nomeNovaCategoria}</strong></p>

                <div style={{ borderTop: "1px solid #ddd", paddingTop: "15px" }}>
                  <h4>Adicionar Campo</h4>
                  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <input type="text" placeholder="Nome do Campo" value={nomeCampoInput} onChange={(e) => setNomeCampoInput(e.target.value)} style={{ flex: 2, padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }} />
                    <select value={tipoCampoInput} onChange={(e) => setTipoCampoInput(e.target.value)} style={{ flex: 1.5, padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}>
                      <option value="TEXTO">Texto</option>
                      <option value="NUMERO">Número</option>
                      <option value="DATA">Data</option>
                      <option value="BOOLEAN">Verdadeiro/Falso</option>
                      <option value="IMAGEM">Imagens</option>
                    </select>
                    <button type="button" onClick={handleAdicionarCampoNaLista} style={{ padding: "9px 15px", background: "var(--laranja-escuro)", color: "white", border: "none", borderRadius: "6px" }}>+ Add</button>
                  </div>
                </div>

                <div style={{ marginTop: "15px", maxHeight: "140px", overflowY: "auto", background: "white", padding: "10px", borderRadius: "6px", border: "1px solid #eee" }}>
                  {listaCamposPersonalizados.map((c, index) => (
                    <li key={index} style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px", fontSize: "0.9rem" }}>
                      <span><strong>{c.nome}</strong> ({c.tipoCampo})</span>
                      <button type="button" onClick={() => handleRemoverCampoTemp(index)} style={{ background: "#dc3545", color: "white", border: "none", borderRadius: "4px", padding: "2px 6px" }}>Remover</button>
                    </li>
                  ))}
                </div>

                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "20px" }}>
                  <button type="button" onClick={fecharModalCategoriaCompleto} style={{ padding: "10px 20px", background: "#6c757d", color: "white", border: "none", borderRadius: "6px" }}>Concluir</button>
                  <button type="button" onClick={handleFinalizarCadastroCampos} className="btnCard" style={{ maxWidth: "200px" }} disabled={loading}>Salvar Campos</button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default Produtos;