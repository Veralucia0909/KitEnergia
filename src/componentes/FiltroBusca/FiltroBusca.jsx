import "./FiltroBusca.css";
function FiltroBusca({ termo, aoMudar, placeholder }) {
  return (
    <div className="filtro-busca">
      <span className="filtro-busca__icone">🔍</span>
      <input
        type="search"
        className="filtro-busca__input"
        placeholder={placeholder || "Buscar..."}
        value={termo}
        onChange={(e) => aoMudar(e.target.value)}
      />
      {termo && (
        <button
          type="button"
          className="filtro-busca__limpar"
          onClick={() => aoMudar("")}
          aria-label="Limpar busca"
        >
      </button>
      )}
    </div>
  );
}

export default FiltroBusca;
