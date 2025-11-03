import { createContext, useState } from "react";
 const ContextoInquilino = createContext();
 export default ContextoInquilino;
 export function ProvedorInquilino({ children }) {
 const [contratoLocaçãoConsultada, setContratoLocaçãoConsultada] = useState({});
 const [imóvelAluguelConsultado, setImóvelAluguelConsultado] = useState(null);
 const [moradorAdicionalInteressado, setMoradorAdicionalInteressado] = useState(null);
 return (
 <ContextoInquilino.Provider value={{ 
    contratoLocaçãoConsultada, setContratoLocaçãoConsultada,
    imóvelAluguelConsultado, setImóvelAluguelConsultado, 
    moradorAdicionalInteressado, setMoradorAdicionalInteressado
 }}>{children}</ContextoInquilino.Provider>
 );
 }