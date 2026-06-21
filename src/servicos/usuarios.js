export const buscarUsuarioLogado = () => {
  const idUsuarioLogado = localStorage.getItem("usuarioLogado");
  if (!idUsuarioLogado) return null;
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  return usuarios.find((u) => u.id === idUsuarioLogado) || null;
};

export const salvarUsuario = (usuarioAtualizado) => {
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const index = usuarios.findIndex((u) => u.id === usuarioAtualizado.id);
  if (index >= 0) usuarios[index] = usuarioAtualizado;
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
};

// Chave antiga isolada por usuário (mantida apenas por compatibilidade, não usada mais)
export const chaveLeiturasUsuario = (idUsuario) => {
  return `kitnets_leituras_user_${idUsuario}`;
};

// ✅ Chave global compartilhada: todas as leituras de todos os usuários
// ficam aqui. O filtro por unidade é feito na tela (admin vê tudo,
// inquilino vê só a própria unidade).
export const CHAVE_LEITURAS_GLOBAL = "kitnets_leituras_todas";
