 import { useContext } from "react";
 import { useNavigate } from "react-router-dom";
 import { Button } from "primereact/button";
 import { Card } from "primereact/card";
 import { Checkbox } from "primereact/checkbox";
 import { Divider } from "primereact/divider";
 import { InputText } from "primereact/inputtext";
 import { InputTextarea } from "primereact/inputtextarea";
 import ContextoUsuário from "../../contextos/contexto-usuário";
 import ContextoInquilino from "../../contextos/contexto-inquilino";
 import { estilizarBotão, estilizarBotãoRetornar, estilizarCard, estilizarCheckbox, 
  estilizarDivCampo, estilizarDivider, estilizarFlex, estilizarInlineFlex, estilizarInputText, 
  estilizarLabel } from "../../utilitários/estilos";
 export default function ConsultarImóvelAluguel() {
  const { usuárioLogado } = useContext(ContextoUsuário);
  const { imóvelAluguelConsultado, setMoradorAdicionalInteressado } = useContext(ContextoInquilino);
  const dados = { 
    nome_aluno: imóvelAluguelConsultado?.morador_adicional?.usuário?.nome,
    mobília_inclusa: imóvelAluguelConsultado?.mobília_inclusa,
    justificativa: imóvelAluguelConsultado?.justificativa,
    título_proposta: imóvelAluguelConsultado?.contrato.título };
  const navegar = useNavigate();
  function retornarPesquisarImóveisAluguel() { navegar("../pesquisar-imoveis-aluguel"); };
  function consultarMoradorAdicionalInteressado() {
    setMoradorAdicionalInteressado(imóvelAluguelConsultado.morador_adicional);
    navegar("../consultar-morador-adicional-interessado");
  };
  return (
    <div className={estilizarFlex()}>
      <Card title="Consultar Interesse" className={estilizarCard(usuárioLogado.cor_tema)}>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>morador_adicional*:</label>
          <InputText name="nome_aluno"
            className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
            value={dados.nome_aluno} disabled/>
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Mobília Inclusa ?*:</label>
          <Checkbox name="mobília_inclusa" checked={dados.mobília_inclusa}
            className={estilizarCheckbox()} autoResize disabled/>
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Justificativa*:</label>
          <InputTextarea name="justificativa"
            className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
            value={dados.justificativa} disabled/>
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>contrato*</label>
          <InputText name="título_proposta"
            className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
            value={dados.título_proposta} disabled/>
        </div>
        <Divider className={estilizarDivider()}/>
        <div className={estilizarInlineFlex()}>
          <Button className={estilizarBotãoRetornar()} label="Retornar" 
             onClick={retornarPesquisarImóveisAluguel}/>
          <Button className={estilizarBotão()} label="morador_adicional" onClick={consultarMoradorAdicionalInteressado}/>
        </div>
      </Card>
    </div>
  );
 }