 import servidor from "./servidor";
 export function serviçoCadastrarInquilino(inquilino)
   { return servidor.post("/inquilinos", inquilino); };
 export function serviçoBuscarInquilino(cpf) { return servidor.get(`/inquilinos/${cpf}`); };