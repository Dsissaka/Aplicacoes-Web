 import { Router } from "express";
 import verificarToken from "../middlewares/verificar-token";
 import verificarPerfilInquilino from "../middlewares/verificar-perfil-inquilino";
 import ServiçosInquilino from "../serviços/serviços-inquilino";
 const RotasInquilino = Router();
 export default RotasInquilino;
 RotasInquilino.post("/", ServiçosInquilino.cadastrarInquilino);
 RotasInquilino.get("/:cpf", verificarToken, verificarPerfilInquilino,   
    ServiçosInquilino.buscarInquilino);