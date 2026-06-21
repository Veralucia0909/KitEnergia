import './BotaoCustomizado.css'

function BotaoCustomizado({ tipo, aoClicar, children, disabled }) {
  const classeVariante = tipo ? `botao-customizado__${tipo}` : ''

  return (
    <button
      className={`botao-customizado__root ${classeVariante}`}
      onClick={aoClicar}
      type="button"
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export const BotaoIcone = ({ variante, onClick, title }) => {
  const icone =
    variante === 'editar' ? (
      /* Ícone de lápis (editar) */
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ) : (
      /* Ícone de lixeira (excluir) */
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6" /><path d="M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      </svg>
    )

  return (
    <button
      className={`btn-icone btn-icone--${variante}`}
      onClick={onClick}
      title={title}
      aria-label={title}
      type="button"
    >
      {icone}
    </button>
  )
}

export default BotaoCustomizado