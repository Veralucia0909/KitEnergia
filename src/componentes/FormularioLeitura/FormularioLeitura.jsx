import { useState, useEffect } from "react";
import { MESES } from "../../utils/constantes";
import { useAppContext } from "../../contexto/AppContext";
import "./FormularioLeitura.css";

// Dados fixos de cada kit: unidade, contrato e locatário
const KITS = [
  { unidade: "Kit 1",  contrato: "833250", locatario: "Mateus Lima" },
  { unidade: "Kit 2",  contrato: "838422", locatario: "Marineli Fonseca" },
  { unidade: "Kit 3",  contrato: "838482", locatario: "Clesio Apôlonio" },
  { unidade: "Kit 4",  contrato: "840133", locatario: "João Pedro" },
  { unidade: "Kit 5",  contrato: "841333", locatario: "Cristiano Terterola" },
  { unidade: "Kit 6",  contrato: "835040", locatario: "Larissa Ribeiro" },
  { unidade: "Kit 7",  contrato: "839879", locatario: "Otávio Vieira" },
  { unidade: "Kit 8",  contrato: "840009", locatario: "Cristiano Gula" },
  { unidade: "Kit 9",  contrato: "834790", locatario: "Osvaldo Souza" },
  { unidade: "Kit 10", contrato: "837237", locatario: "Fernanda Menezes" },
  { unidade: "Kit 11", contrato: "834612", locatario: "Fabricio Firmino" },
  { unidade: "Kit 12", contrato: "840176", locatario: "Henrique Fujita" },
];

function calcularStatus(consumo) {
  if (consumo > 200) return "Alto";
  if (consumo > 100) return "Normal";
  return "Baixo";
}

// Retorna a data de hoje no formato YYYY-MM-DD
function dataHoje() {
  const h = new Date();
  return `${h.getFullYear()}-${String(h.getMonth() + 1).padStart(2,"0")}-${String(h.getDate()).padStart(2,"0")}`;
}

// Formata número com vírgula: 215.82 → "215,82"
function fmt(valor, casas = 2) {
  return Number(valor).toFixed(casas).replace(".", ",");
}

const VAZIO = { unidade: "", contrato: "", locatario: "", anterior: "", atual: "", data: dataHoje() };

function FormularioLeitura({ aoSalvar, leituraEditando, aoCancelar, tarifaKwh, leituras = [] }) {
  // ✅ Pega o perfil do contexto: isAdmin e a unidade vinculada ao inquilino
  const { isAdmin, unidadeDoUsuario } = useAppContext();

  const [form, setForm]           = useState(VAZIO);
  const [erros, setErros]         = useState({});
  const [bloqueado, setBloqueado] = useState(false);

  // Preenche o formulário ao editar
  useEffect(() => {
    if (leituraEditando) {
      setForm({
        unidade:   leituraEditando.unidade,
        contrato:  leituraEditando.codigoContrato || "",
        locatario: leituraEditando.locatario,
        anterior:  leituraEditando.leituraAnterior,
        atual:     leituraEditando.leituraAtual,
        data:      leituraEditando.dataLeitura,
      });
      setBloqueado(false);
    } else {
      setForm(VAZIO);
      setBloqueado(false);
    }
    setErros({});
  }, [leituraEditando]);

  // ✅ Inquilino: pré-seleciona automaticamente a unidade dele e trava o campo
  useEffect(() => {
    if (!isAdmin && unidadeDoUsuario && !leituraEditando) {
      const kit    = KITS.find(k => k.unidade === unidadeDoUsuario);
      const ultimo = leituras
        .filter(l => l.unidade === unidadeDoUsuario)
        .sort((a, b) => new Date(b.dataLeitura) - new Date(a.dataLeitura))[0];

      setForm(prev => ({
        ...prev,
        unidade:   unidadeDoUsuario,
        contrato:  kit?.contrato  || "",
        locatario: kit?.locatario || "",
        anterior:  ultimo?.leituraAtual ?? "",
        atual:     "",
      }));
      setBloqueado(!!ultimo);
    }
  }, [isAdmin, unidadeDoUsuario, leituras, leituraEditando]);

  // Admin: pode escolher qualquer unidade
  const handleUnidade = (e) => {
    const nome   = e.target.value;
    const kit    = KITS.find(k => k.unidade === nome);
    const ultimo = leituras
      .filter(l => l.unidade === nome)
      .sort((a, b) => new Date(b.dataLeitura) - new Date(a.dataLeitura))[0];

    setBloqueado(!!ultimo);
    setForm(prev => ({
      ...prev,
      unidade:   nome,
      contrato:  kit?.contrato  || "",
      locatario: kit?.locatario || "",
      anterior:  ultimo?.leituraAtual ?? "",
      atual:     "",
    }));
    setErros({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (erros[name]) setErros(prev => ({ ...prev, [name]: "" }));
  };

  const validar = () => {
    const e = {};
    if (!form.unidade)        e.unidade  = "Selecione a unidade.";
    if (form.anterior === "") e.anterior = "Informe a leitura anterior.";
    if (form.atual === "")    e.atual    = "Informe a leitura atual.";
    if (!form.data)           e.data     = "Informe a data.";
    const ant = Number(form.anterior), atu = Number(form.atual);
    if (!e.anterior && !e.atual && atu < ant)
      e.atual = "Leitura atual deve ser ≥ à anterior.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ SEGURANÇA CRÍTICA: bloqueia envio se inquilino tentar salvar outra unidade
    if (!isAdmin && form.unidade !== unidadeDoUsuario) {
      setErros({ unidade: "Você só pode registrar leituras da sua própria unidade." });
      return;
    }

    const errosVal = validar();
    if (Object.keys(errosVal).length > 0) { setErros(errosVal); return; }

    const ant     = Number(form.anterior);
    const atu     = Number(form.atual);
    const consumo = atu - ant;
    const mesIdx  = parseInt(form.data.split("-")[1]) - 1;

    aoSalvar({
      id:              leituraEditando ? leituraEditando.id : String(Date.now()),
      unidade:         form.unidade,
      codigoContrato:  form.contrato,
      locatario:       form.locatario,
      leituraAnterior: ant,
      leituraAtual:    atu,
      dataLeitura:     form.data,
      consumo,
      mes:             MESES[mesIdx],
      valorCobrar:     Number((consumo * tarifaKwh).toFixed(2)),
      status:          calcularStatus(consumo),
    });

    // Admin limpa o form; inquilino mantém a unidade
    if (isAdmin) {
      setForm(VAZIO);
    } else {
      setForm(prev => ({ ...prev, anterior: form.atual, atual: "" }));
    }
    setErros({});
    setBloqueado(false);
  };

  const modoEdicao     = Boolean(leituraEditando);
  const ant            = Number(form.anterior);
  const atu            = Number(form.atual);
  const consumoPreview = form.anterior !== "" && form.atual !== "" && atu >= ant ? atu - ant : null;

  return (
    <form className="formulario-leitura__root" onSubmit={handleSubmit} noValidate>

      <div className="formulario-leitura__titulo">
        <span className="formulario-leitura__raio">⚡</span>
        {modoEdicao ? "Editar Leitura" : "Nova Leitura"}
      </div>

      <div className="formulario-leitura__grade">

        {/* Unidade: admin → select livre | inquilino → campo travado */}
        <div className={`formulario-leitura__campo ${erros.unidade ? "formulario-leitura__campo--erro" : ""}`}>
          <label className="formulario-leitura__rotulo">UNIDADE / KIT *</label>
          {isAdmin ? (
            <select className="formulario-leitura__input" name="unidade" value={form.unidade} onChange={handleUnidade}>
              <option value="">Selecione...</option>
              {KITS.map(k => <option key={k.unidade} value={k.unidade}>{k.unidade}</option>)}
            </select>
          ) : (
            <input
              className="formulario-leitura__input formulario-leitura__readonly"
              value={form.unidade || "Unidade não vinculada – contate o administrador"}
              readOnly
            />
          )}
          {erros.unidade && <span className="formulario-leitura__erro">{erros.unidade}</span>}
        </div>

        {/* Contrato */}
        <div className="formulario-leitura__campo">
          <label className="formulario-leitura__rotulo">CONTRATO</label>
          <input className="formulario-leitura__input formulario-leitura__readonly" value={form.contrato} readOnly placeholder="Automático" />
        </div>

        {/* Locatário */}
        <div className="formulario-leitura__campo formulario-leitura__full">
          <label className="formulario-leitura__rotulo">LOCATÁRIO</label>
          <input className="formulario-leitura__input formulario-leitura__readonly" value={form.locatario} readOnly placeholder="Automático" />
        </div>

        {/* Leitura Anterior */}
        <div className={`formulario-leitura__campo ${erros.anterior ? "formulario-leitura__campo--erro" : ""}`}>
          <label className="formulario-leitura__rotulo">LEIT. ANTERIOR *</label>
          <div className="formulario-leitura__grupo">
            <input
              className={`formulario-leitura__input ${bloqueado ? "formulario-leitura__gravado" : ""}`}
              name="anterior"
              type="number"
              min="0"
              value={form.anterior}
              onChange={handleChange}
              readOnly={bloqueado}
              placeholder="Ex: 124563"
            />
            {bloqueado && (
              <button type="button" className="formulario-leitura__botao-editar" onClick={() => setBloqueado(false)} title="Editar">✏️</button>
            )}
          </div>
          {bloqueado && <span className="formulario-leitura__info">📌 Do último registro — clique ✏️ para editar</span>}
          {erros.anterior && <span className="formulario-leitura__erro">{erros.anterior}</span>}
        </div>

        {/* Leitura Atual */}
        <div className={`formulario-leitura__campo ${erros.atual ? "formulario-leitura__campo--erro" : ""}`}>
          <label className="formulario-leitura__rotulo">LEIT. ATUAL *</label>
          <input className="formulario-leitura__input" name="atual" type="number" min="0"
            value={form.atual} onChange={handleChange} placeholder="Digite a leitura" />
          {erros.atual && <span className="formulario-leitura__erro">{erros.atual}</span>}
        </div>

        {/* Data */}
        <div className={`formulario-leitura__campo formulario-leitura__full ${erros.data ? "formulario-leitura__campo--erro" : ""}`}>
          <label className="formulario-leitura__rotulo">DATA DA LEITURA *</label>
          <input className="formulario-leitura__input" name="data" type="date"
            value={form.data} onChange={handleChange} />
          {erros.data && <span className="formulario-leitura__erro">{erros.data}</span>}
        </div>

        {/* Preview consumo */}
        {consumoPreview !== null && (
          <div className="formulario-leitura__preview formulario-leitura__full">
            <span className="formulario-leitura__preview-rotulo">Consumo calculado:</span>
            <span className="formulario-leitura__preview-valor">
              {fmt(consumoPreview)} kWh
              <span className="formulario-leitura__preview-reais"> ≈ R$ {fmt(consumoPreview * tarifaKwh)}</span>
            </span>
          </div>
        )}
      </div>

      <button type="submit" className={`formulario-leitura__submit ${modoEdicao ? "formulario-leitura__submit--edicao" : ""}`}>
        {modoEdicao ? "SALVAR ALTERAÇÕES" : "REGISTRAR LEITURA"}
      </button>

      {modoEdicao && (
        <button type="button" className="formulario-leitura__cancelar" onClick={aoCancelar}>Cancelar edição</button>
      )}
    </form>
  );
}

export default FormularioLeitura;
