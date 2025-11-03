 import { useContext, useRef, useState } from "react";
 import { useNavigate } from "react-router-dom";
 import { Button } from "primereact/button";
 import { Card } from "primereact/card";
 import { Checkbox } from "primereact/checkbox";
 import { Divider } from "primereact/divider";
 import { Dropdown } from "primereact/dropdown";
 import { InputText } from "primereact/inputtext";
 import { InputTextarea } from "primereact/inputtextarea";
 import { Toast } from "primereact/toast";
 import ContextoUsuário from "../../contextos/contexto-usuário";
 import ContextoMoradorAdicional from "../../contextos/contexto-morador-adicional";
 import { serviçoCadastrarImóvelAluguel, serviçoRemoverImóvelAluguel } from "../../serviços/serviços-morador-adicional";
 import mostrarToast from "../../utilitários/mostrar-toast";
 import { MostrarMensagemErro, checarListaVazia, validarCamposObrigatórios }
  from "../../utilitários/validações";
 import { estilizarBotão, estilizarBotãoRetornar, estilizarBotãoRemover, estilizarCard, 
  estilizarCheckbox, estilizarDivCampo, estilizarDivider, estilizarFlex, estilizarInlineFlex, 
  estilizarInputText, estilizarInputTextarea, estilizarLabel } from "../../utilitários/estilos";
 export default function CadastrarImóvelAluguel() {
  const referênciaToast = useRef(null);
  const { usuárioLogado } = useContext(ContextoUsuário);
  const { imóvelAluguelConsultado, contratoLocaçãoSelecionada,  setContratoLocaçãoImóvelAluguel, setContratoLocaçãoConsultada } = useContext(ContextoMoradorAdicional);
  const [dados, setDados] = useState({ 
    id_proposta: contratoLocaçãoSelecionada?.id || "",
    nível_interesse: contratoLocaçãoSelecionada?.nível_interesse || "",
    tenho_pet: imóvelAluguelConsultado?.tenho_pet || false,
    mobília_inclusa: imóvelAluguelConsultado?.mobília_inclusa || false,
    valor_negociação: imóvelAluguelConsultado?.valor_negociação || "",
    interessado_desde: imóvelAluguelConsultado?.interessado_desde || "",
    justificativa: imóvelAluguelConsultado?.justificativa || "" });
  const [erros, setErros] = useState({});
  const navegar = useNavigate();
  
  function alterarEstado(event) {
    const chave = event.target.name || event.value;
    let valor = event.target.value || event.checked;
    setDados({ ...dados, [chave]: valor });
  };
  function validarCampos() {
    const { 
       nível_interesse,
       tenho_pet,
       mobília_inclusa, 
       valor_negociação, 
       justificativa, 
       interessado_desde } = dados;
    let errosCamposObrigatórios = validarCamposObrigatórios({ nível_interesse, tenho_pet, mobília_inclusa, valor_negociação, justificativa, interessado_desde });
    setErros(errosCamposObrigatórios);
    return checarListaVazia(errosCamposObrigatórios);
  };
   function propostaLabel() {
    if (imóvelAluguelConsultado?.título || contratoLocaçãoSelecionada)
       return "Proposta Selecionada*:";
    else return "Selecione uma Proposta*:";
  };
  function pesquisarContratosLocação() { navegar("../pesquisar-contratos-locacao"); };
  function retornarAdministrarImóveisAluguel() { navegar("../administrar-imoveis-aluguel"); };
  async function cadastrarImóvelAluguel() {
    if (validarCampos()) {
      try {
        await serviçoCadastrarImóvelAluguel({ ...dados, id: dados.id_proposta, cpf: usuárioLogado.cpf});
        mostrarToast(referênciaToast, "Interesse cadastrado com sucesso!", "sucesso");
      } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "erro"); }
    }
  };

  function consultarContratoLocaçãoImóvelAluguel() {
    setContratoLocaçãoConsultada(null);
    setContratoLocaçãoImóvelAluguel(imóvelAluguelConsultado?.contrato);
    navegar("../consultar-contrato-locacao");
 };
  
  async function removerImóvelAluguel() {
    try {
      await serviçoRemoverImóvelAluguel(imóvelAluguelConsultado.id);
      mostrarToast(referênciaToast, "Interesse removido com sucesso!", "sucesso");
    } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "erro"); }
  };
  function BotõesAções() {
    if (imóvelAluguelConsultado) {
      return (
        <div className={estilizarInlineFlex()}>
          <Button className={estilizarBotãoRetornar()} label="Retornar" 
             onClick={retornarAdministrarImóveisAluguel}/>
          <Button className={estilizarBotãoRemover()} label="Remover" onClick={removerImóvelAluguel}/>
          <Button className={estilizarBotão()} label="Proposta" onClick={consultarContratoLocaçãoImóvelAluguel}/>
        </div>
      );
    } else {
      return (
        <div className={estilizarInlineFlex()}>
          <Button className={estilizarBotãoRetornar()} label="Retornar" 
             onClick={retornarAdministrarImóveisAluguel}/>
          <Button className={estilizarBotão()} label="Cadastrar" onClick={cadastrarImóvelAluguel}/>
        </div>
      );
    }
  };
  function títuloFormulário() {
    if (imóvelAluguelConsultado) return "Remover Interesse";
    else return "Cadastrar Interesse";
  };
  function ContratoLocaçãoInputText() {
    if (contratoLocaçãoSelecionada?.título) {
      return <InputText name="título"
        className={estilizarInputText(erros.título, 400, usuárioLogado.cor_tema)}
        value={contratoLocaçãoSelecionada?.título} disabled/>
    } else if (imóvelAluguelConsultado?.contrato_locação?.título) {
      return <InputText name="título_proposta"
        className={estilizarInputText(erros.título, 400, usuárioLogado.cor_tema)}
        value={imóvelAluguelConsultado?.contrato_locação?.título} disabled/>
    } else return null;
  };
  function BotãoSelecionar() {
    if (!contratoLocaçãoSelecionada && !imóvelAluguelConsultado) {
      return <Button className={estilizarBotão()} label="Selecionar" onClick={pesquisarContratosLocação}/>
    } else if (contratoLocaçãoSelecionada) {
      return <Button className={estilizarBotão()} label="Substituir" onClick={pesquisarContratosLocação}/>;
    } else return null;
  };
  return (
    <div className={estilizarFlex()}>
      <Toast ref={referênciaToast} onHide={retornarAdministrarImóveisAluguel
        
      } position="bottom-center"/>
      <Card title={títuloFormulário()} className={estilizarCard(usuárioLogado.cor_tema)}>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>{propostaLabel()}</label>
          <BotãoSelecionar/>
          <ContratoLocaçãoInputText/>
          <MostrarMensagemErro mensagem={erros.id}/>
        </div>

        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Categoria*:</label>
          <Dropdown
          name="nível_interesse"
          value={dados.nível_interesse}
          options={[
            { label: "Alto", value: "Alto" },
            { label: "Médio", value: "Médio" },
            { label: "Baixo", value: "Baixo" },
            { label: "Urgente", value: "Urgente"}]}
          placeholder="Selecione"
          className={estilizarInputText(erros.nível_interesse, 200, usuárioLogado.cor_tema)}
          onChange={(e) => setDados({ ...dados, nível_interesse: e.value })}/>
          <MostrarMensagemErro mensagem={erros.nível_interesse}/>
        </div>

        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Eu tenho pet*:</label>
          <Checkbox name="tenho_pet" checked={dados.tenho_pet}
          className={estilizarCheckbox()} onChange={alterarEstado}/>
        </div>
        
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Eu possuo mobília para levar*:</label>
          <Checkbox name="mobília_inclusa" checked={dados.mobília_inclusa}
            className={estilizarCheckbox()} onChange={alterarEstado} autoResize/>
        </div>

        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Valor disposto a pagar*:</label>
          <InputText name="valor_negociação" value={dados.valor_negociação}
          className={estilizarInputText(erros.valor_negociação, 200, usuárioLogado.cor_tema)}
          onChange={alterarEstado}/>
          <MostrarMensagemErro mensagem={erros.valor_negociação}/>
        </div>

        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Justifique o interesse em uma mensagem ao locatário*:</label>
          <InputTextarea name="justificativa" value={dados.justificativa}
            className={estilizarInputTextarea(erros.justificativa, usuárioLogado.cor_tema)} 
            onChange={alterarEstado} autoResize cols={40}/>
          <MostrarMensagemErro mensagem={erros.justificativa}/>
        </div>
         <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Interessado desde:*:</label>
          <InputText name="interessado_desde" type="date" value={dados.interessado_desde} 
          className={estilizarInputText(erros.interessado_desde, usuárioLogado.cor_tema)}
          onChange={alterarEstado}/>
        <MostrarMensagemErro mensagem={erros.interessado_desde}/>
      </div>


        <Divider className={estilizarDivider()}/>
        <BotõesAções/>
      </Card>
    </div>
  );
 }