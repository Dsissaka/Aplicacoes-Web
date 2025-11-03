 import { createContext, useState } from "react";
 const ContextoMoradorAdicional = createContext();
 export default ContextoMoradorAdicional;
 export function ProvedorMoradorAdicional({ children }) {
 const [imóvelAluguelConsultado, setImóvelAluguelConsultado] = useState({});
 const [contratoLocaçãoConsultada, setContratoLocaçãoConsultada] = useState({});
 const [contratoLocaçãoSelecionada, setContratoLocaçãoSelecionada] = useState({});
 const [contratoImóvel, setContratoLocaçãoImóvelAluguel] = useState({});
 const [inquilinoProponente, setInquilinoProponente] = useState({});
 return (
 <ContextoMoradorAdicional.Provider value={{
 imóvelAluguelConsultado, setImóvelAluguelConsultado,
 contratoLocaçãoConsultada, setContratoLocaçãoConsultada, 
 contratoLocaçãoSelecionada, setContratoLocaçãoSelecionada,
 contratoImóvel, setContratoLocaçãoImóvelAluguel,
 inquilinoProponente, setInquilinoProponente
 }}>{children}</ContextoMoradorAdicional.Provider>
 );
 }