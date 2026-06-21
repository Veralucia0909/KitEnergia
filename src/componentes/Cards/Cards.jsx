import { MdEdit, MdDelete } from "react-icons/md";
import "./Cards.css";

const fmtKwh = (v) => Number(v).toFixed(2).replace(".", ",");
const fmtReais = (v) =>
  Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function Cards({ leituras, aoEditar, aoExcluir }) {
  return (
    <div className="cards__root">
      {leituras.length === 0 ? (
        <p className="cards__vazio">Nenhuma leitura encontrada.</p>
      ) : (
        <div className="cards__grade">
          {leituras.map((l) => (
            <div key={l.id} className="cards__item">

              <div className="cards__topo">
                <span className="cards__kit">{l.unidade}</span>
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  {l.faturaGerada && (
                    <span className="status-badge status-badge--fatura">
                      📄 Fatura emitida
                    </span>
                  )}
                  {l.status && (
                    <span className={`status-badge status-badge--${l.status.toLowerCase()}`}>
                      {l.status}
                    </span>
                  )}
                </div>
              </div>

              <div className="cards__locatario">{l.locatario}</div>
              <div className="cards__contrato">Contrato {l.codigoContrato}</div>

              <div className="cards__metricas">
                <div className="cards__metrica">
                  <span className="cards__metrica-label">Mês</span>
                  <span className="cards__metrica-valor">{l.mes}</span>
                </div>
                <div className="cards__metrica">
                  <span className="cards__metrica-label">Consumo</span>
                  <span className="cards__metrica-valor">
                    {fmtKwh(l.consumo)} <small>kWh</small>
                  </span>
                </div>
                <div className="cards__metrica cards__metrica--valor">
                  <span className="cards__metrica-label">A Cobrar</span>
                  <span className="cards__metrica-valor">
                    <small>R$</small> {fmtReais(l.valorCobrar)}
                  </span>
                </div>
              </div>

              <div className="cards__acoes">
                <button
                  className="cards__btn cards__btn--editar"
                  onClick={() => aoEditar(l)}
                  title="Editar"
                >
                  <MdEdit size={16} /> Editar
                </button>
                <button
                  className="cards__btn cards__btn--excluir"
                  onClick={() => {
                    if (window.confirm(`Excluir leitura de "${l.unidade}"?`)) {
                      aoExcluir(l.id);
                    }
                  }}
                  title="Excluir"
                >
                  <MdDelete size={16} /> Excluir
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cards;
