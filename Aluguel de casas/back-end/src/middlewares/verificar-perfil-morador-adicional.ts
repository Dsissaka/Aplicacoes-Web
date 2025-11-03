import { Perfil } from '../entidades/usuário';
 export default function verificarPerfilMoradorAdicional(request, response, next) {
 if (request.perfil === Perfil.MORADORADICIONAL) return next();
 else return response.status(401).json({ erro: "Acesso não autorizado." });
 };