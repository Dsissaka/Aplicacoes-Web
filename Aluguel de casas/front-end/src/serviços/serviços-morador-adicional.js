import servidor from "./servidor";
 export function serviçoCadastrarMoradorAdicional(moradoradicional) { return servidor.post("/moradores", moradoradicional); };
 export function serviçoAtualizarMoradorAdicional(moradoradicional) { return servidor.patch("/moradores", moradoradicional); };
 export function serviçoBuscarMoradorAdicional(cpf) { return servidor.get(`/moradores/${cpf}`); };
 export function serviçoCadastrarImóvelAluguel(imovel) { return servidor.post("/moradores/imoveis", imovel); };
 export function serviçoRemoverImóvelAluguel(id) { return servidor.delete(`/moradores/imoveis/${id}`); };
 export function serviçoBuscarImóveisAluguelMoradorAdicional(cpf) {return servidor.get(`/moradores/imoveis/morador/${cpf}`); };
 export function serviçoBuscarContratosLocação() { return servidor.get("/moradores/imoveis/contratos"); };