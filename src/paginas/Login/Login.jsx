import "./Login.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import BotaoCustomizado from "../../componentes/BotaoCustomizado/BotaoCustomizado";
import CampoCustomizado from "../../componentes/CampoCustomizado/CampoCustomizado";
import Principal from "../../componentes/Principal/Principal";

function Login() {
  const [loginForm, setLoginForm]   = useState({ email: "", senha: "" });
  const [carregando, setCarregando] = useState(false);

  const entrar = () => {
    if (!loginForm.email.trim() || !loginForm.senha.trim()) {
      toast.error("Preencha todos os campos para entrar!");
      return;
    }

    setCarregando(true);

    setTimeout(() => {
      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

      // Compatível com senhas em btoa() e texto puro (cadastros antigos)
      const usuarioEncontrado = usuarios.find((u) => {
        if (u.email !== loginForm.email) return false;
        try {
          return atob(u.senha) === loginForm.senha;
        } catch {
          return u.senha === loginForm.senha;
        }
      });

      if (!usuarioEncontrado) {
        toast.error("Email ou senha incorretos!");
        setCarregando(false);
        return;
      }

      localStorage.setItem("usuarioLogado", usuarioEncontrado.id);
      window.location.href = "/";
    }, 300);
  };

  return (
    <Principal>
      <div className="login__form">
        {/* CORREÇÃO AQUI: Força o caminho absoluto dinamicamente usando a origem da URL */}
        <img src={window.location.origin + "/logo.svg"} alt="KitEnergia" className="login__logo" />
        <h2 className="login__titulo">Seja bem-vindo!</h2>

        <CampoCustomizado
          label="E-mail"
          type="email"
          value={loginForm.email}
          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
          onKeyPress={(e) => e.code === "Enter" && entrar()}
        />

        <CampoCustomizado
          type="password"
          label="Senha"
          value={loginForm.senha}
          onChange={(e) => setLoginForm({ ...loginForm, senha: e.target.value })}
          onKeyPress={(e) => e.code === "Enter" && entrar()}
        />

        <BotaoCustomizado tipo="primario" aoClicar={entrar} disabled={carregando}>
          {carregando ? "Entrando..." : "Entrar"}
        </BotaoCustomizado>

        <Link to="/novo-usuario" className="login__link-cadastro">
          Não tem uma conta? Cadastre-se!
        </Link>
      </div>
    </Principal>
  );
}

export default Login;