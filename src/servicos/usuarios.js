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

export const chaveLeiturasUsuario = (idUsuario) => {
  return `kitnets_leituras_user_${idUsuario}`;
};
