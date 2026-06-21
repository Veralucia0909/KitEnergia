import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppContext } from "../../contexto/AppContext";

// Componente que protege as rotas privadas
// Redireciona para /login se o usuário não estiver autenticado
function ValidarAutenticacao() {
  const navigate = useNavigate();
  const { usuarioLogado } = useAppContext();

  useEffect(() => {
    if (!usuarioLogado) {
      navigate("/login");
    }
  }, [navigate, usuarioLogado]);

  return usuarioLogado ? <Outlet /> : null;
}

export default ValidarAutenticacao;
