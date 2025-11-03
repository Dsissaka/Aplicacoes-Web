 import { useContext } from "react";
 import { useNavigate } from "react-router-dom";
 import { Button } from "primereact/button";
 import { Card } from "primereact/card";
 import { Checkbox } from "primereact/checkbox";
 import { Divider } from "primereact/divider";
 import { InputMask } from "primereact/inputmask";
 import { InputText } from "primereact/inputtext";
 import ContextoUsuário from "../../contextos/contexto-usuário";
 import ContextoInquilino from "../../contextos/contexto-inquilino";
 import { ANO_MÁSCARA} from "../../utilitários/máscaras";
 import {TAMANHOS, estilizarBotãoRetornar, estilizarCard, estilizarDivCampo, estilizarDivider, 
  estilizarFlex, estilizarInlineFlex, estilizarInputMask, estilizarInputText, estilizarLabel }
  from "../../utilitários/estilos";
 export default function ConsultarMoradorAdicional() {
  const { usuárioLogado } = useContext(ContextoUsuário);
  const { moradorAdicionalInteressado } = useContext(ContextoInquilino);
  const dados = { 
    nome: moradorAdicionalInteressado?.usuário?.nome,
    rotina: moradorAdicionalInteressado?.rotina,
    ano_ingresso: moradorAdicionalInteressado?.ano_ingresso,
    precisa_cuidado: moradorAdicionalInteressado?.precisa_cuidado };
  const navegar = useNavigate();
  function retornarConsultarImóvelAluguel() { navegar("../consultar-imovel-aluguel"); };
  return (
    <div className={estilizarFlex()}>
      <Card title="Consultar Aluno" className={estilizarCard(usuárioLogado.cor_tema)}>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Nome*:</label>
          <InputText name="nome" className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
            value={dados.nome} disabled/>
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>rotina*:</label>
          <InputText name="rotina" className={estilizarInputText(null, 300, usuárioLogado.cor_tema)}
            value={dados.rotina} disabled/>
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Ano de Ingresso*:</label>
          <InputMask name="ano_ingresso" autoClear size={TAMANHOS.ANO} mask={ANO_MÁSCARA} 
            value={dados.ano_ingresso} 
            className={estilizarInputMask(null, usuárioLogado.cor_tema)} disabled/>
        </div>
      <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(usuárioLogado.cor_tema)}>Precisa de Cuidado Especial?*:</label>
          <Checkbox inputId="precisa_cuidado"
            name="precisa_cuidado" checked={dados.precisa_cuidado === true}
            className={estilizarInputText(usuárioLogado.cor_tema)}/>
      </div>
        <Divider className={estilizarDivider(dados.cor_tema)}/>
        <div className={estilizarInlineFlex()}>
          <Button className={estilizarBotãoRetornar()} label="Retornar" 
             onClick={retornarConsultarImóvelAluguel}/>
        </div>
      </Card>
    </div>
  );
 };