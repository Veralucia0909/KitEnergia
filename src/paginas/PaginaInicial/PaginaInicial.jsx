import { useNavigate } from "react-router-dom";
import "./PaginaInicial.css";

function PaginaInicial() {
  const navigate = useNavigate();

  return (
    <div className="pagina-inicial">

      {/* Card único: logo + texto + botões juntos */}
      <div className="pagina-inicial__card">

        {/* Logo centralizada */}
        <div className="pagina-inicial__logo-wrap">
          <img src="/logo.svg" alt="KitEnergia" className="pagina-inicial__logo" />
        </div>

        {/* Subtítulo */}
        <p className="pagina-inicial__subtitulo">
          Controle de consumo de energia<br />das suas kitnets.
        </p>

        {/* Botões de navegação */}
        <button className="nav-btn nav-btn--azul" onClick={() => navigate("/lista-leituras")}>
          📋 Lista de Leituras
        </button>

        <button className="nav-btn nav-btn--laranja" onClick={() => navigate("/cadastro-leitura")}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: "middle", marginRight: "6px" }}>
            <polygon
              points="13,2 4,14 11,14 11,22 20,10 13,10"
              fill="#000000"
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          Cadastro de Leitura
        </button>

      </div>
    </div>
  );
}

export default PaginaInicial;
