import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppContext } from "../../contexto/AppContext";
import { CHAVE_LEITURAS_GLOBAL } from "../../servicos/usuarios";
import useLocalStorage from "../../utils/useLocalStorage";
import FormularioLeitura from "../../componentes/FormularioLeitura/FormularioLeitura";
import "./CadastroLeitura.css";

function CadastroLeitura() {
  const { leituraId } = useParams();
  const navigate       = useNavigate();
  const { isAdmin, unidadeDoUsuario } = useAppContext();

  // ✅ Todas as leituras ficam na mesma chave global
  const [leituras, setLeituras] = useLocalStorage(CHAVE_LEITURAS_GLOBAL, []);

  const leituraEncontrada = leituraId
    ? leituras.find((l) => l.id === leituraId) || null
    : null;

  // ✅ Segurança: inquilino não pode editar leitura de outra unidade
  const leituraEditando =
    leituraEncontrada && !isAdmin && leituraEncontrada.unidade !== unidadeDoUsuario
      ? null
      : leituraEncontrada;

  const aoSalvar = (registro) => {
    setLeituras((prev) =>
      leituraEditando
        ? prev.map((l) => (l.id === registro.id ? registro : l))
        : [registro, ...prev]
    );
    toast.success(leituraEditando ? "✅ Leitura atualizada!" : "✅ Leitura registrada!");
    navigate("/lista-leituras");
  };

  return (
    <div className="cadastro-page">
      <FormularioLeitura
        aoSalvar={aoSalvar}
        leituraEditando={leituraEditando}
        aoCancelar={() => navigate("/lista-leituras")}
        tarifaKwh={0.7855}
        leituras={leituras}
      />
    </div>
  );
}

export default CadastroLeitura;
