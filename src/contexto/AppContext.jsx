/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo } from "react";
import { buscarUsuarioLogado } from "../servicos/usuarios";

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const usuarioLogadoDefault = buscarUsuarioLogado();
  const [usuarioLogado, setUsuarioLogado] = useState(usuarioLogadoDefault);

  const isAdmin = useMemo(
    () => !usuarioLogado?.unidade,
    [usuarioLogado]
  );

  const unidadeDoUsuario = useMemo(
    () => usuarioLogado?.unidade || null,
    [usuarioLogado]
  );

  return (
    <AppContext.Provider value={{ usuarioLogado, setUsuarioLogado, isAdmin, unidadeDoUsuario }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
export default AppContextProvider;
