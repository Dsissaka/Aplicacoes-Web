 import { Route, BrowserRouter, Routes } from "react-router-dom";
 import RotasUsuárioLogado from "./rotas-usuário-logado";
 import LogarUsuário from "../páginas/usuário/logar-usuário";
 import CadastrarUsuário from "../páginas/usuário/cadastrar-usuário";
 import PáginaInicial from "../páginas/usuário/página-inicial";
 import CadastrarInquilino from "../páginas/inquilino/cadastrar-inquilino";
 import RecuperarAcesso from "../páginas/usuário/recuperar-acesso";
 import CadastrarMoradorAdicional from "../páginas/morador-adicional/cadastrar-morador-adicional";
  import { ProvedorInquilino } from "../contextos/contexto-inquilino";
 import { ProvedorMoradorAdicional } from "../contextos/contexto-morador-adicional";
 import RotasInquilino from "./rotas-inquilino"
 import RotasMoradorAdicional from "./rotas-morador-adicional"
 import AdministrarContratosLocação from "../páginas/inquilino/administrar-contratos-locação";
 import CadastrarContratoLocação from "../páginas/inquilino/cadastrar-contrato-locação";
 import AdministrarImóveisAluguel from "../páginas/morador-adicional/administrar-imóveis-aluguel";
 import CadastrarImóvelAluguel from "../páginas/morador-adicional/cadastrar-imóvel-aluguel";
 import PesquisarContratosLocação from "../páginas/morador-adicional/pesquisar-contratos-locação";
 import ConsultarContratoLocação from "../páginas/morador-adicional/consultar-contrato-locação";
 import PesquisarImóveisAluguel from "../páginas/inquilino/pesquisar-imóveis-aluguel";
 import ConsultarImóvelAluguel from "../páginas/inquilino/consultar-imóvel-aluguel";
 import ConsultarMoradorAdicional from "../páginas/inquilino/consultar-morador-adicional";
 import ConsultarInquilino from "../páginas/morador-adicional/consultar-inquilino";
 export default function RotasAplicação() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LogarUsuário/>} path="/"/>
        <Route element={<CadastrarUsuário/>} path="criar-usuario"/>
        <Route element={<RecuperarAcesso/>} path="recuperar-acesso"/>
        <Route element={<RotasUsuárioLogado/>}>
          <Route element={<PáginaInicial/>} path="pagina-inicial"/>
          <Route element={<CadastrarUsuário/>} path="atualizar-usuario"/>
          <Route element={<ProvedorInquilino><RotasInquilino/></ProvedorInquilino>}>
            <Route element={<CadastrarInquilino/>} path="cadastrar-inquilino"/>
            <Route element={<AdministrarContratosLocação/>} path="administrar-contratos-locacao"/>
            <Route element={<CadastrarContratoLocação/>} path="cadastrar-contrato-locacao"/>
            <Route element={<PesquisarImóveisAluguel/>} path="pesquisar-imoveis-aluguel"/>
            <Route element={<ConsultarImóvelAluguel/>} path="consultar-imovel-aluguel"/>
            <Route element={<ConsultarMoradorAdicional/>} path="consultar-morador-adicional-interessado"/>
          </Route>
          <Route element={<ProvedorMoradorAdicional><RotasMoradorAdicional/></ProvedorMoradorAdicional>}>
            <Route element={<CadastrarMoradorAdicional/>} path="cadastrar-morador-adicional"/>
            <Route element={<AdministrarImóveisAluguel/>} path="administrar-imoveis-aluguel"/>
            <Route element={<CadastrarImóvelAluguel/>} path="cadastrar-imovel-aluguel"/>
            <Route element={<PesquisarContratosLocação/>} path="pesquisar-contratos-locacao"/>
            <Route element={<ConsultarContratoLocação/>} path="consultar-contrato-locacao"/>
            <Route element={<ConsultarInquilino/>} path="consultar-inquilino-proponente"/>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
 };