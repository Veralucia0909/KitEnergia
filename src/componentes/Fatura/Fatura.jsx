import { useRef } from "react";
import "./Fatura.css";

function gerarCodigoBarras(leitura) {
  const base = `${leitura.codigoContrato}${leitura.consumo}${leitura.valorCobrar}`;
  const num = base.replace(/\D/g, "").padEnd(48, "0").slice(0, 48);
  return `${num.slice(0, 10)} ${num.slice(10, 21)} ${num.slice(21, 32)} ${num.slice(32, 48)}`;
}

function urlQrCode(leitura) {
  const texto = `KitEnergia|${leitura.unidade}|${leitura.mes}|R$${Number(leitura.valorCobrar).toFixed(2)}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(texto)}`;
}

// Consumo formatado com 2 casas decimais
const fmtKwh = (v) => Number(v).toFixed(2).replace(".", ",");

function Fatura({ leitura, aoFechar }) {
  const faturaRef = useRef(null);

  const fmtReais = (v) =>
    Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const fmtData = (iso) => {
    if (!iso) return "-";
    const [a, m, d] = iso.split("-");
    return `${d}/${m}/${a}`;
  };

  const vencimento = () => {
    const d = new Date();
    d.setDate(d.getDate() + 10);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  };

  // CSS de impressão com contraste correto: texto preto sobre fundo branco
  const imprimir = () => {
    const conteudo = faturaRef.current.innerHTML;
    const janela = window.open("", "_blank", "width=800,height=700");
    janela.document.write(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"/>
      <title>Fatura – ${leitura.unidade}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; background: #ffffff; color: #000000; padding: 20px; }
        .fatura-documento { max-width: 640px; margin: 0 auto; border: 2px solid #3a4f7a; border-radius: 12px; overflow: hidden; background: #ffffff; }
        .fatura-documento__cabecalho { background: #3a4f7a; color: #ffffff; padding: 18px 22px; display: flex; justify-content: space-between; align-items: center; }
        .fatura-documento__titulo { font-size: 20px; color: #ffffff; }
        .fatura-documento__badge { background: #f59e0b; color: #000000; border-radius: 20px; padding: 3px 12px; font-weight: 700; font-size: 13px; }
        .fatura-documento__corpo { padding: 22px; background: #ffffff; color: #000000; }
        .fatura-documento__grade { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 22px; margin-bottom: 14px; }
        .fatura-documento__rotulo { font-size: 11px; color: #555555; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 2px; }
        .fatura-documento__valor { font-size: 14px; font-weight: 700; color: #000000; margin-bottom: 12px; }
        .fatura-documento__total { background: #eef2f9; border: 2px solid #3a4f7a; border-radius: 8px; padding: 12px 18px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .fatura-documento__total-rotulo { font-size: 14px; font-weight: 700; color: #3a4f7a; }
        .fatura-documento__total-valor { font-size: 24px; font-weight: 900; color: #3a4f7a; }
        .fatura-documento__divisor { border: none; border-top: 1px dashed #cccccc; margin: 12px 0; }
        .fatura-documento__codigo { font-family: 'Courier New', monospace; font-size: 12px; letter-spacing: .12em; color: #000000; text-align: center; padding: 8px; border: 1px solid #dddddd; border-radius: 6px; margin-bottom: 14px; word-break: break-all; }
        .fatura-documento__qrcode { text-align: center; }
        .fatura-documento__qrcode img { width: 90px; }
        .fatura-documento__qrcode p { font-size: 10px; color: #555555; margin-top: 4px; }
        .fatura-documento__rodape { background: #f5f5f5; color: #666666; padding: 8px 22px; text-align: center; font-size: 10px; }
        @media print { body { padding: 0; } }
      </style></head><body>${conteudo}</body></html>`);
    janela.document.close();
    setTimeout(() => janela.print(), 400);
  };

  if (!leitura) return null;

  return (
    <div className="fatura-overlay" onClick={aoFechar}>
      <div className="fatura-modal" onClick={(e) => e.stopPropagation()}>
        <div ref={faturaRef}>
          <div className="fatura-documento">

            <div className="fatura-documento__cabecalho">
              <div>
                <h1 className="fatura-documento__titulo">⚡ KitEnergia</h1>
                <span className="fatura-documento__subtitulo">Conta de Energia</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="fatura-documento__badge">{leitura.unidade}</div>
                <div style={{ fontSize: "11px", marginTop: "5px", color: "rgba(255,255,255,0.85)" }}>
                  Vencimento: {vencimento()}
                </div>
              </div>
            </div>

            <div className="fatura-documento__corpo">
              <div className="fatura-documento__grade">
                <div>
                  <div className="fatura-documento__rotulo">Locatário</div>
                  <div className="fatura-documento__valor">{leitura.locatario}</div>
                </div>
                <div>
                  <div className="fatura-documento__rotulo">Contrato</div>
                  <div className="fatura-documento__valor">{leitura.codigoContrato || "-"}</div>
                </div>
                <div>
                  <div className="fatura-documento__rotulo">Referência</div>
                  <div className="fatura-documento__valor">{leitura.mes}</div>
                </div>
                <div>
                  <div className="fatura-documento__rotulo">Data</div>
                  <div className="fatura-documento__valor">{fmtData(leitura.dataLeitura)}</div>
                </div>
              </div>

              <hr className="fatura-documento__divisor" />

              <div className="fatura-documento__grade">
                <div>
                  <div className="fatura-documento__rotulo">Leitura Anterior</div>
                  <div className="fatura-documento__valor">
                    {Number(leitura.leituraAnterior).toLocaleString("pt-BR")}
                  </div>
                </div>
                <div>
                  <div className="fatura-documento__rotulo">Leitura Atual</div>
                  <div className="fatura-documento__valor">
                    {Number(leitura.leituraAtual).toLocaleString("pt-BR")}
                  </div>
                </div>
                <div>
                  <div className="fatura-documento__rotulo">Consumo</div>
                  <div className="fatura-documento__valor">{fmtKwh(leitura.consumo)} kWh</div>
                </div>
                <div>
                  <div className="fatura-documento__rotulo">Tarifa</div>
                  <div className="fatura-documento__valor">R$ 0,7855</div>
                </div>
              </div>

              <hr className="fatura-documento__divisor" />

              <div className="fatura-documento__total">
                <div className="fatura-documento__total-rotulo">💰 Total a Pagar</div>
                <div className="fatura-documento__total-valor">R$ {fmtReais(leitura.valorCobrar)}</div>
              </div>

              <div className="fatura-documento__codigo">{gerarCodigoBarras(leitura)}</div>

              <div className="fatura-documento__qrcode">
                <img
                  src={urlQrCode(leitura)}
                  alt="QR Code PIX"
                  onError={(e) => (e.target.style.display = "none")}
                />
                <p>QR Code PIX fictício para pagamento</p>
              </div>
            </div>

            <div className="fatura-documento__rodape">
              KitEnergia – Documento fictício gerado em {new Date().toLocaleDateString("pt-BR")}
            </div>
          </div>
        </div>

        <div className="fatura-modal__acoes">
          <button className="fatura-modal__botao fatura-modal__botao--imprimir" onClick={imprimir}>
            🖨️ Imprimir / PDF
          </button>
          <button className="fatura-modal__botao fatura-modal__botao--fechar" onClick={aoFechar}>
            ✕ Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Fatura;
