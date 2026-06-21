// Página de cadastro/edição de leitura
// Usa o id do usuário logado para salvar dados isolados por usuário
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppContext } from "../../contexto/AppContext";
import { chaveLeiturasUsuario } from "../../servicos/usuarios";
import useLocalStorage from "../../utils/useLocalStorage";
import FormularioLeitura from "../../componentes/FormularioLeitura/FormularioLeitura";
import "./CadastroLeitura.css";

function CadastroLeitura() {
  const { leituraId } = useParams();
  const navigate      = useNavigate();

  // Pega o usuário logado pelo contexto global
  const { usuarioLogado } = useAppContext();

  // Chave única por usuário – cada um tem seus próprios dados
  const [leituras, setLeituras] = useLocalStorage(chaveLeiturasUsuario(usuarioLogado.id), []);

  const leituraEditando = leituraId
    ? leituras.find((l) => l.id === leituraId) || null
    : null;

  const tarifaKwh = 0.7855;

  const aoSalvar = (registro) => {
    setLeituras((prev) =>
      leituraEditando
        ? prev.map((l) => (l.id === registro.id ? registro : l))
        : [registro, ...prev]
    );
    toast.success(leituraEditando ? "✅ Leitura atualizada!" : "✅ Leitura registrada!");
    navigate("/lista-leituras");
  };

  const aoCancelar = () => navigate("/lista-leituras");

  return (
    <div className="cadastro-page">
      <FormularioLeitura
        aoSalvar={aoSalvar}
        leituraEditando={leituraEditando}
        aoCancelar={aoCancelar}
        tarifaKwh={tarifaKwh}
        leituras={leituras}
      />
    </div>
  );
}

export default CadastroLeitura;
