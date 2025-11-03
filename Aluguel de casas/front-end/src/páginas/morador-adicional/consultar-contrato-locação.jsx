import { useContext } from "react";
 import { useNavigate } from "react-router-dom";
 import { Button } from "primereact/button";
 import { Card } from "primereact/card";
 import { Checkbox } from "primereact/checkbox";
 import { Divider } from "primereact/divider";
 import { InputText } from "primereact/inputtext";
 import { InputNumber } from "primereact/inputnumber";
 import { InputTextarea } from "primereact/inputtextarea";
 import ContextoUsuário from "../../contextos/contexto-usuário";
 import ContextoMoradorAdicional from "../../contextos/contexto-morador-adicional";
 import {  estilizarBotão, estilizarBotãoRetornar, estilizarCard, estilizarCheckbox, estilizarDivCampo, 
  estilizarDivider, estilizarFlex, estilizarInlineFlex, estilizarInputNumber,estilizarInputText, estilizarLabel }
  from "../../utilitários/estilos";
 export default function ConsultarContratoLocação() {
  const { usuárioLogado } = useContext(ContextoUsuário);
  const { contratoLocaçãoConsultada, contratoImóvel, setInquilinoProponente } = useContext(ContextoMoradorAdicional);
  const dados = { 
    nome_inquilino: contratoLocaçãoConsultada?.inquilino?.usuário?.nome || contratoImóvel?.inquilino?.usuário?.nome,
    título: contratoLocaçãoConsultada?.título || contratoImóvel?.título,
    status: contratoLocaçãoConsultada?.status || contratoImóvel?.status,
    bairro: contratoLocaçãoConsultada?.bairro || contratoImóvel?.bairro,
    data_fim: contratoLocaçãoConsultada?.data_fim || contratoImóvel?.data_fim,
    descrição_casa: contratoLocaçãoConsultada?.descrição_casa || contratoImóvel?.descrição_casa,
    valor_mensal: contratoLocaçãoConsultada?.valor_mensal || contratoImóvel?.valor_mensal,
    dia_pagamento: contratoLocaçãoConsultada?.dia_pagamento || contratoImóvel?.dia_pagamento,
    endereço: contratoLocaçãoConsultada?.endereço || contratoImóvel?.endereço,
    finalizada: contratoLocaçãoConsultada?.finalizada || contratoImóvel?.finalizada};
  const navegar = useNavigate();

   function consultarInquilinoProponente() {
      if (contratoLocaçãoConsultada) setInquilinoProponente(contratoLocaçãoConsultada.inquilino);
      else setInquilinoProponente(contratoImóvel.inquilino);
      navegar("../consultar-inquilino-proponente");
    };

   function retornar() { 
    if (contratoLocaçãoConsultada) navegar("../pesquisar-contratos-locacao");
    else if (contratoImóvel) navegar("../cadastrar-imovel-aluguel");
  };
  return (
    <div className={estilizarFlex()}>
      <Card title="Consultar Proposta" className={estilizarCard(usuárioLogado.cor_tema)}>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>inquilino*:</label>
          <InputText name="nome_inquilino"
            className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
            value={dados.nome_inquilino} disabled/>
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Título*:</label>
          <InputText name="título" className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
            value={dados.título} disabled/>
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>status*:</label>
          <InputText name="status"
          className={estilizarInputText(null, 200, usuárioLogado.cor_tema)}
          value={dados.status} disabled/>
        </div>    
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Área de Atuação*:</label>
          <InputText name="bairro"
             className={estilizarInputText(null, 350, usuárioLogado.cor_tema)}
          value={dados.bairro} disabled/>
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Data de Fim*:</label>
          <InputText name="data_fim" type="date" value={dados.data_fim} 
            className={estilizarInputText(null, usuárioLogado.cor_tema)} disabled/>
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Data de Pagamento*:</label>
          <InputText name="dia_pagamento" type="date" value={dados.dia_pagamento} 
            className={estilizarInputText(null, usuárioLogado.cor_tema)} disabled/>
        </div>

        <div className={estilizarDivCampo()}>
                  <label className={estilizarLabel(usuárioLogado.cor_tema)}>Valor mensal do aluguel (R$)*:</label>
                  <InputNumber name="valor_mensal"
                    size={5} value={dados.valor_mensal}
                    mode="decimal"
                    disabled
                    inputClassName={estilizarInputNumber(null, usuárioLogado.cor_tema)}
                  />
          </div>

        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>descrição_casa*:</label>
          <InputTextarea name="descrição_casa" value={dados.descrição_casa}
            className={estilizarInputText(null, 400, usuárioLogado.cor_tema)} autoResize disabled/>
        </div>

         <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Endereço*:</label>
          <InputTextarea name="endereço" value={dados.endereço}
            className={estilizarInputText(null, 400, usuárioLogado.cor_tema)} autoResize disabled/>
        </div>

        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Proposta finalizada?*:</label>
          <Checkbox name="finalizada" checked={dados.finalizada}
            className={estilizarCheckbox(null)} autoResize disabled/>
        </div>  
        <Divider className={estilizarDivider()}/>
        <div className={estilizarInlineFlex()}>
          <Button className={estilizarBotãoRetornar()} label="Retornar" onClick={retornar}/>
          <Button className={estilizarBotão()} label="Inquilino" onClick={consultarInquilinoProponente}/>
        </div>
      </Card>
    </div>
  );
 }
