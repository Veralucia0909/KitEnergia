function validarSenha(senha) {
  // Senha deve ter no mínimo 4 caracteres
  return senha.trim().length >= 4;
}

export default validarSenha;
