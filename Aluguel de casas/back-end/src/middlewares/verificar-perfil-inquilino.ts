import { Perfil } from "../entidades/usuário";
 export default function verificarPerfilProfessor(request, response, next) {
 if (request.perfil === Perfil.INQUILINO) return next();
 else return response.status(401).json({ erro: "Acesso não autorizado." });
 };