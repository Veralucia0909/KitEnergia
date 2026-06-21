// imports de bibliotecas externas, instaladas via npm
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Cabecalho from "./componentes/Cabecalho/Cabecalho";
import Rodape from "./Rodape/Rodape";
import ValidarAutenticacao from "./componentes/ValidarAutenticacao/ValidarAutenticacao";
import AppContextProvider from "./contexto/AppContext";
import Login from "./paginas/Login/Login";
import NovoUsuario from "./paginas/NovoUsuario/NovoUsuario";
import PaginaInicial from "./paginas/PaginaInicial/PaginaInicial";
import ListaLeituras from "./paginas/ListaLeituras/ListaLeituras";
import CadastroLeitura from "./paginas/CadastroLeitura/CadastroLeitura";
import PerfilUsuario from "./paginas/PerfiUsuario/PerfilUsuario";
import PaginaInvalida from "./paginas/PaginaInvalida/PaginaInvalida";

const roteador = createBrowserRouter([
  // Rotas públicas – acessíveis sem estar logado
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "novo-usuario",
    element: <NovoUsuario />,
  },

  // Rotas privadas – só acessíveis com usuário autenticado
  {
    path: "",
    element: <ValidarAutenticacao />,
    children: [
      {
        path: "",
        element: <PaginaInicial />,
      },
      {
        path: "meu-perfil",
        element: <PerfilUsuario />,
      },
      {
        path: "lista-leituras",
        element: <ListaLeituras />,
      },
      {
        path: "cadastro-leitura/:leituraId?",
        element: <CadastroLeitura />,
      },
    ],
  },

  // Rota 404
  {
    path: "*",
    element: <PaginaInvalida />,
  },
]);

function App() {
  return (
    <>
      <AppContextProvider>
        <Cabecalho />
        <RouterProvider router={roteador} />
        <Rodape />
        <ToastContainer />
      </AppContextProvider>
    </>
  );
}

export default App;
