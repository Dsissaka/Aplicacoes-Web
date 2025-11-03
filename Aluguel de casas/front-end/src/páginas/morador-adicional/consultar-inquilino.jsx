 import { useContext } from "react";
 import { useNavigate } from "react-router-dom";
 import { Button } from "primereact/button";
 import { Card } from "primereact/card";
 import { Divider } from "primereact/divider";
 import { InputNumber } from "primereact/inputnumber";
 import { InputText } from "primereact/inputtext";
 import ContextoUsuário from "../../contextos/contexto-usuário";
 import ContextoMoradorAdicional from "../../contextos/contexto-morador-adicional";
 import { estilizarBotãoRetornar, estilizarCard, estilizarDivCampo, estilizarDivider, estilizarFlex,
  estilizarInlineFlex, estilizarInputText, estilizarLabel } from "../../utilitários/estilos";
 export default function ConsultarInquilino() {
  const { usuárioLogado } = useContext(ContextoUsuário);
  const { inquilinoProponente } = useContext(ContextoMoradorAdicional);
  const dados = { 
    nome_professor: inquilinoProponente?.usuário?.nome,
    tipo: inquilinoProponente?.tipo,
    tempo_alugando: inquilinoProponente?.tempo_alugando };
  const navegar = useNavigate();
  function retornarConsultarContratoLocação() { navegar("/consultar-contrato-locacao"); };
  return (
    <div className={estilizarFlex()}>
      <Card title="Consultar Inquilino" className={estilizarCard(usuárioLogado.cor_tema)}>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Nome do Inquilino*:</label>
          <InputText name="nome_professor"
            className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
            value={dados.nome_professor} disabled/>
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Tipo de inquilino*:</label>
          <InputText name="tipo"
            className={estilizarInputText(null, 150, usuárioLogado.cor_tema)}
            value={dados.tipo} autoResize disabled/>    
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
             Tempo alugando casas*:</label>
          <InputNumber name="tempo_alugando" size={5} 
              value={dados.tempo_alugando} 
              inputClassName={estilizarInputText(null, usuárioLogado.cor_tema)}
              mode="decimal" min={1} disabled/>
        </div>
        <Divider className={estilizarDivider(dados.cor_tema)}/>
        <div className={estilizarInlineFlex()}>
          <Button className={estilizarBotãoRetornar()} label="Retornar" 
             onClick={retornarConsultarContratoLocação}/>
        </div>
      </Card>
    </div>
  );
 };