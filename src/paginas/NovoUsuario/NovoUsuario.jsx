import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BotaoCustomizado from "../../componentes/BotaoCustomizado/BotaoCustomizado";
import CampoCustomizado from "../../componentes/CampoCustomizado/CampoCustomizado";
import Principal from "../../componentes/Principal/Principal";
import validarEmail from "../../utils/validarEmail";
import validarSenha from "../../utils/validarSenha";

const KITS = [
  "Kit 1","Kit 2","Kit 3","Kit 4","Kit 5","Kit 6",
  "Kit 7","Kit 8","Kit 9","Kit 10","Kit 11","Kit 12",
];

function forcaSenha(s) {
  if (!s) return null;
  if (s.length < 4) return { texto: "Fraca", cor: "#ef4444" };
  if (s.length < 8) return { texto: "Média", cor: "#f59e0b" };
  return { texto: "Forte", cor: "#22c55e" };
}

function NovoUsuario() {
  const navigate = useNavigate();
  const [usuarioForm, setUsuarioForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmacaoSenha: "",
    tipoConta: "inquilino", // ✅ "inquilino" ou "administrador"
    unidade: "",
  });
  const forca = forcaSenha(usuarioForm.senha);
  const ehAdministrador = usuarioForm.tipoConta === "administrador";

  const salvar = () => {
    if (!usuarioForm.nome.trim() || !usuarioForm.email.trim() || !usuarioForm.senha.trim()) {
      toast.error("Todos os campos são obrigatórios.");
      return;
    }
    if (!validarEmail(usuarioForm.email)) {
      toast.error("Email inválido.");
      return;
    }
    if (!validarSenha(usuarioForm.senha)) {
      toast.error("A senha deve conter no mínimo 4 caracteres.");
      return;
    }
    if (usuarioForm.senha !== usuarioForm.confirmacaoSenha) {
      toast.error("As senhas não coincidem.");
      return;
    }

    // ✅ Unidade só é obrigatória para inquilino
    if (!ehAdministrador && !usuarioForm.unidade) {
      toast.error("Selecione sua unidade.");
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    if (usuarios.find((u) => u.email === usuarioForm.email)) {
      toast.error("Este email já está cadastrado.");
      return;
    }

    // Remove campos auxiliares antes de salvar
    const { confirmacaoSenha, tipoConta, ...dadosUsuario } = usuarioForm;

    // ✅ Administrador é salvo SEM o campo "unidade" — isso já ativa o isAdmin no AppContext
    const novoUsuario = ehAdministrador
      ? { ...dadosUsuario, unidade: "" }
      : dadosUsuario;

    usuarios.push({
      id: crypto.randomUUID(),
      ...novoUsuario,
      senha: btoa(usuarioForm.senha),
    });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    toast.success("Usuário cadastrado com sucesso!");
    navigate("/login");
  };

  return (
    <Principal titulo="Novo Usuário" voltarPara="/login">
      <CampoCustomizado
        label="Nome"
        value={usuarioForm.nome}
        onChange={(e) => setUsuarioForm({ ...usuarioForm, nome: e.target.value })}
        obrigatorio
      />

      <CampoCustomizado
        label="Email"
        type="email"
        value={usuarioForm.email}
        onChange={(e) => setUsuarioForm({ ...usuarioForm, email: e.target.value })}
        onBlur={(e) => { if (!validarEmail(e.target.value)) toast.error("Email inválido."); }}
        obrigatorio
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <CampoCustomizado
          label="Senha"
          type="password"
          value={usuarioForm.senha}
          onChange={(e) => setUsuarioForm({ ...usuarioForm, senha: e.target.value })}
          onBlur={(e) => { if (!validarSenha(e.target.value)) toast.error("Mínimo 4 caracteres."); }}
          obrigatorio
        />
        {forca && (
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ height: "4px", background: "var(--border)", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: "4px",
                background: forca.cor, transition: "width 0.3s",
                width: forca.texto === "Fraca" ? "33%" : forca.texto === "Média" ? "66%" : "100%"
              }} />
            </div>
            <span style={{ fontSize: "0.75rem", color: forca.cor }}>
              Força: <strong>{forca.texto}</strong>
            </span>
          </div>
        )}
      </div>

      <CampoCustomizado
        label="Confirmação da Senha"
        type="password"
        value={usuarioForm.confirmacaoSenha}
        onChange={(e) => setUsuarioForm({ ...usuarioForm, confirmacaoSenha: e.target.value })}
        obrigatorio
      />

      {/* ✅ Select de tipo de conta */}
      <div className="campo-customizado__root">
        <span>Tipo de Conta *</span>
        <select
          className="campo-customizado__input"
          value={usuarioForm.tipoConta}
          onChange={(e) => setUsuarioForm({ ...usuarioForm, tipoConta: e.target.value, unidade: "" })}
        >
          <option value="inquilino">Inquilino</option>
          <option value="administrador">Administrador</option>
        </select>
      </div>

      {/* ✅ Unidade só aparece para Inquilino */}
      {!ehAdministrador && (
        <div className="campo-customizado__root">
          <span>Sua Unidade *</span>
          <select
            className="campo-customizado__input"
            value={usuarioForm.unidade}
            onChange={(e) => setUsuarioForm({ ...usuarioForm, unidade: e.target.value })}
          >
            <option value="">Selecione o kit...</option>
            {KITS.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>
      )}

      <BotaoCustomizado tipo="secundario" aoClicar={salvar}>
        Salvar
      </BotaoCustomizado>
    </Principal>
  );
}

export default NovoUsuario;
