 import { Router } from "express";
 import verificarToken from "../middlewares/verificar-token";
 import verificarPerfilInquilino from "../middlewares/verificar-perfil-inquilino";
 import ServiçosInquilino from "../serviços/serviços-inquilino";
import verificarErroConteúdoToken from "src/middlewares/verificar-erro-conteúdo-token";
 const RotasInquilino = Router();
 export default RotasInquilino;
 RotasInquilino.post("/", ServiçosInquilino.cadastrarInquilino);
 RotasInquilino.get("/:cpf", verificarToken, verificarPerfilInquilino,   
    ServiçosInquilino.buscarInquilino);
RotasInquilino.patch("/", verificarToken, verificarPerfilInquilino, 
   ServiçosInquilino.atualizarInquilino);
   RotasInquilino.post("/contratos", verificarToken, verificarPerfilInquilino, 
  ServiçosInquilino.cadastrarContratoLocação);
 RotasInquilino.patch("/contratos", verificarToken, verificarPerfilInquilino, 
  ServiçosInquilino.alterarContratoLocação);
 RotasInquilino.delete("/contratos/:id", verificarToken, verificarPerfilInquilino, 
  ServiçosInquilino.removerContratoLocação);
 RotasInquilino.get("/contratos/inquilino/:cpf", verificarToken, verificarPerfilInquilino, 
  verificarErroConteúdoToken, ServiçosInquilino.buscarContratosLocaçãoInquilino);
 RotasInquilino.get("/contratos/bairros", verificarToken, verificarPerfilInquilino, 
  ServiçosInquilino.buscarBairroContratosLocação);
   RotasInquilino.get("/imoveis/:id_proposta", verificarToken, verificarPerfilInquilino,
 ServiçosInquilino.buscarImóveisAluguelContratoLocação);