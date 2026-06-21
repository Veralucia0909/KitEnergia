import { useAppContext } from "../../contexto/AppContext";
import Avatar from "../Avatar/Avatar";
import "./Cabecalho.css";

function Cabecalho() {
  const { usuarioLogado, setUsuarioLogado } = useAppContext();

  const sair = () => {
    localStorage.removeItem("usuarioLogado");
    setUsuarioLogado(null);
    window.location.href = "/login";
  };

  return (
    <header className="cabecalho__root">
      <a href="/" className="cabecalho__brand">
        {/* <img src="/logo.svg" alt="KitEnergia" className="cabecalho__logo" /> */}
        <img src={window.location.origin + "/logo.svg"} alt="KitEnergia" className="cabecalho__logo" />
      </a>

      {usuarioLogado && (
        <div className="cabecalho__direita">
          <span className="cabecalho__nome">
            Olá, {usuarioLogado.nome?.split(" ")[0]}!
          </span>
          <a href="/meu-perfil" className="cabecalho__avatar-link">
            <Avatar nome={usuarioLogado.nome} imagem={usuarioLogado.foto} />
          </a>
          <button className="cabecalho__logout" onClick={sair}>Sair</button>
        </div>
      )}
    </header>
  );
}

export default Cabecalho;
