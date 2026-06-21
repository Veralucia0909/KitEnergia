// Página exibida quando o usuário acessa uma rota inexistente (404)
import { useNavigate } from "react-router-dom";
import "./PaginaInvalida.css";

function PaginaInvalida() {
  const navigate = useNavigate();

  return (
    <div className="pagina-invalida">
      <span className="pagina-invalida__codigo">404</span>
      <h2 className="pagina-invalida__titulo">Página não encontrada!</h2>
      <p>A rota que você tentou acessar não existe.</p>
      <button className="pagina-invalida__btn" onClick={() => navigate("/")}>
        Voltar ao início
      </button>
    </div>
  );
}

export default PaginaInvalida;
