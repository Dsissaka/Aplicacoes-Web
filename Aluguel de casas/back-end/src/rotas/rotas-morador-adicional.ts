import { Router } from "express";
 import verificarToken from "../middlewares/verificar-token";
 import verificarPerfilMoradorAdicional from "../middlewares/verificar-perfil-morador-adicional";
 import ServiçosMoradorAdicional from "../serviços/serviços-morador-adicional";
 import verificarErroConteúdoToken from "src/middlewares/verificar-erro-conteúdo-token";

 console.log("RotasMoradorAdicional foi carregado");

 const RotasMoradorAdicional = Router();
 RotasMoradorAdicional.post("/", ServiçosMoradorAdicional.cadastrarMoradorAdicional);
 RotasMoradorAdicional.patch("/", verificarToken, verificarPerfilMoradorAdicional, ServiçosMoradorAdicional.atualizarMoradorAdicional);
 RotasMoradorAdicional.get("/:cpf", verificarToken, verificarPerfilMoradorAdicional, ServiçosMoradorAdicional.buscarMoradorAdicional);
 RotasMoradorAdicional.post("/imoveis", verificarToken, verificarPerfilMoradorAdicional, ServiçosMoradorAdicional.cadastrarImóvelAluguel);
 RotasMoradorAdicional.delete("/imoveis/:id", verificarToken, verificarPerfilMoradorAdicional, ServiçosMoradorAdicional.removerImóvelAluguel);
 RotasMoradorAdicional.get("/imoveis/morador/:cpf", verificarToken, verificarPerfilMoradorAdicional, verificarErroConteúdoToken, ServiçosMoradorAdicional.buscarImóveisAluguelMoradorAdicional);
 RotasMoradorAdicional.get("/imoveis/contratos/", verificarToken, verificarPerfilMoradorAdicional,     ServiçosMoradorAdicional.buscarContratosLocação);
 export default RotasMoradorAdicional;