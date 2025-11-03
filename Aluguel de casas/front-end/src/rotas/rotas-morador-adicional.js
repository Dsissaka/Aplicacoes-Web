import { useContext } from "react";
 import { Navigate, Outlet } from "react-router-dom";
 import UsuárioContext from "../contextos/contexto-usuário";
 export default function RotasMoradorAdicional() {
 const { usuárioLogado  } = useContext(UsuárioContext);
 if (usuárioLogado.perfil === "morador_adicional") return <Outlet/>
 else return <Navigate to="/"/>;
 }