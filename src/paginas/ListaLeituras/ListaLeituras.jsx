import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MdAddCircle } from "react-icons/md";
import useLocalStorage from "../../utils/useLocalStorage";
import { chaveLeiturasUsuario } from "../../servicos/usuarios";
import { useAppContext } from "../../contexto/AppContext";
import FiltroBusca from "../../componentes/FiltroBusca/FiltroBusca";
import Cards from "../../componentes/Cards/Cards.jsx";
import Fatura from "../../componentes/Fatura/Fatura";
import "./ListaLeituras.css";

function calcularStatus(consumo) {
  if (consumo > 200) return "Alto";
  if (consumo > 100) return "Normal";
  return "Baixo";
}

function ListaLeituras() {
  const navigate = useNavigate();
  const { usuarioLogado } = useAppContext();

  const [leituras, setLeituras] = useLocalStorage(chaveLeiturasUsuario(usuarioLogado.id), []);
  const [busca, setBusca]               = useState("");
  const [tarifa, setTarifa]             = useState("0.7855");
  const [historicoAberto, setHistoricoAberto] = useState(false);
  const [faturaAberta, setFaturaAberta]       = useState(null);

   useEffect(() => {
    const precisaMigrar = leituras.some(l => !l.status);
    if (precisaMigrar) {
      setLeituras(prev =>
        prev.map(l => l.status ? l : { ...l, status: calcularStatus(l.consumo) })
      );
    }
      }, []);

  const aoExcluir = (id) => {
    setLeituras(prev => prev.filter(l => l.id !== id));
    toast.success("🗑️ Registro excluído.");
  };

  const aoEditar = (reg) => navigate(`/cadastro-leitura/${reg.id}`);

  const abrirFatura = (leitura) => {
    setLeituras(prev =>
      prev.map(l => l.id === leitura.id ? { ...l, faturaGerada: true } : l)
    );
    setFaturaAberta(leitura);
  };

  const leiturasFiltradas = useMemo(() => {
    const t = busca.toLowerCase().trim();

    // Sem busca: mostra tudo
    if (!t) return leituras;

    // Busca especial por faturas emitidas
    if (t === "fatura" || t === "faturas") {
      return leituras.filter((x) => x.faturaGerada === true);
    }

    // Busca normal: unidade, contrato, mês ou status
    return leituras.filter((x) => {
      const unidade  = (x.unidade || "").toLowerCase();
      const contrato = (x.codigoContrato || "").toLowerCase();
      const mes      = (x.mes || "").toLowerCase();
      const status   = (x.status || "").toLowerCase();

      return (
        unidade.includes(t) ||
        contrato.includes(t) ||
        mes.includes(t) ||
        status.includes(t)
      );
    });
  }, [leituras, busca]);

  const stats = useMemo(() => {
    const total        = leiturasFiltradas.length;
    const consumoTotal = leiturasFiltradas.reduce((s, l) => s + l.consumo, 0);
    const valorTotal   = leiturasFiltradas.reduce((s, l) => s + (l.valorCobrar || 0), 0);
    const maior        = leiturasFiltradas.reduce((mx, l) => (l.consumo > (mx?.consumo ?? -1) ? l : mx), null);
    const ultima       = [...leiturasFiltradas].sort((a, b) => new Date(b.dataLeitura) - new Date(a.dataLeitura))[0] || null;
    return { total, consumoTotal, valorTotal, maior, ultima };
  }, [leiturasFiltradas]);

  const historico = useMemo(() =>
    [...leiturasFiltradas].sort((a, b) => new Date(b.dataLeitura) - new Date(a.dataLeitura)),
    [leiturasFiltradas]
  );

  const fmtKwh = (v) => Number(v).toFixed(2).replace(".", ",");
  const fmtReais = v =>
    v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="lista-page">
      <h1 className="lista-page__titulo">Lista de Leituras</h1>

      <FiltroBusca
        termo={busca}
        aoMudar={setBusca}
        placeholder="Buscar unidade, mês, status, fatura..."
      />

      {/* Tarifa – mantida separada da busca */}
      <div className="lista-page__filtros">
        <div className="ctrl-group">
          <span className="ctrl-label">Tarifa R$/kWh</span>
          <input className="ctrl-input" type="number" step="0.0001" min="0"
            value={tarifa} onChange={e => setTarifa(e.target.value)} />
        </div>
      </div>

      {/* Stats 2x2 */}
      <div className="stats">
        <div className="stat stat--clicavel" onClick={() => setHistoricoAberto(v => !v)} title="Ver histórico">
          <div className="stat__num stat__num--white">{stats.total}</div>
          <div className="stat__label">Leituras {historicoAberto ? "▲" : "▼"}</div>
        </div>
        <div className="stat">
          <div className="stat__num">{fmtKwh(stats.consumoTotal)} <small>kWh</small></div>
          <div className="stat__label">Consumo Total</div>
        </div>
        <div className="stat stat--green">
          <div className="stat__num stat__num--green">R$ {fmtReais(stats.valorTotal)}</div>
          <div className="stat__label">Total a Cobrar</div>
        </div>
        <div className="stat stat--amber">
          <div className="stat__num">{stats.maior ? stats.maior.unidade : "–"}</div>
          <div className="stat__label">Maior Consumo</div>
        </div>
      </div>

      {/* Botão Baixar Fatura */}
      {stats.ultima && (
        <button className="btn-baixar-fatura" onClick={() => abrirFatura(stats.ultima)}>
          📄 Baixar Fatura — {stats.ultima.mes} ({stats.ultima.unidade})
        </button>
      )}

      {/* Histórico expansível */}
      {historicoAberto && (
        <div className="historico-panel">
          <div className="historico-panel__titulo">📋 Histórico de Leituras</div>
          {historico.length === 0 ? (
            <p className="historico-panel__vazio">Nenhuma leitura registrada.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="historico-table">
                <thead>
                  <tr><th>Unidade</th><th>Mês</th><th>Data</th><th>Consumo</th><th>Status</th><th>Valor</th><th>PDF</th></tr>
                </thead>
                <tbody>
                  {historico.map(l => (
                    <tr key={l.id}>
                      <td><strong style={{ color: "var(--amber)" }}>{l.unidade}</strong></td>
                      <td><span className="badge-mes">{l.mes}</span></td>
                      <td>{l.dataLeitura?.split("-").reverse().join("/")}</td>
                      <td>{fmtKwh(l.consumo)} kWh</td>
                      <td><span className={`status-badge status-badge--${(l.status || "Normal").toLowerCase()}`}>{l.status || "Normal"}</span></td>
                      <td style={{ color: "var(--green)", fontWeight: 700 }}>R$ {fmtReais(l.valorCobrar)}</td>
                      <td><button className="historico-table__btn-fatura" onClick={() => abrirFatura(l)}>📄</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Lista de cards — sem busca interna */}
      <div className="lista-page__lista">
        <Cards
          leituras={leiturasFiltradas}
          aoEditar={aoEditar}
          aoExcluir={aoExcluir}
        />
      </div>

      {/* Botão + */}
      <div className="btn-adicionar-wrap">
        <MdAddCircle size={52} onClick={() => navigate("/cadastro-leitura")} title="Nova Leitura" />
      </div>

      {/* Modal fatura */}
      {faturaAberta && <Fatura leitura={faturaAberta} aoFechar={() => setFaturaAberta(null)} />}
    </div>
  );
}

export default ListaLeituras;
