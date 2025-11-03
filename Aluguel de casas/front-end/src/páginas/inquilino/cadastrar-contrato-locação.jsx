 import { useContext, useEffect, useRef, useState } from "react";
 import { useNavigate } from "react-router-dom";
 import { Button } from "primereact/button";
 import { Card } from "primereact/card";
 import { Checkbox } from "primereact/checkbox";
 import { Divider } from "primereact/divider";
 import { Dropdown } from "primereact/dropdown";
 import { InputText } from "primereact/inputtext";
 import { InputNumber } from "primereact/inputnumber";
 import { InputTextarea } from "primereact/inputtextarea";
 import { Toast } from "primereact/toast";
 import ContextoUsuário from "../../contextos/contexto-usuário";
 import ContextoInquilino from "../../contextos/contexto-inquilino";
 import { serviçoAlterarContratoLocação, serviçoCadastrarContratoLocação, serviçoRemoverContratoLocação, 
  serviçoBuscarBairroContratos } from "../../serviços/serviços-inquilino";
 import mostrarToast from "../../utilitários/mostrar-toast";
 import { MostrarMensagemErro, checarListaVazia, validarCamposObrigatórios }
  from "../../utilitários/validações";
  import { estilizarBotão, estilizarBotãoRemover, estilizarBotãoRetornar, estilizarCard, 
  estilizarCheckbox, estilizarDivCampo, estilizarDivider, estilizarDropdown, estilizarFlex, 
  estilizarInlineFlex, estilizarInputText, estilizarInputTextarea, estilizarInputNumber,estilizarLabel }
  from "../../utilitários/estilos";
 export default function CadastrarContratoLocação() {
  const referênciaToast = useRef(null);
  const { usuárioLogado } = useContext(ContextoUsuário);
  const { contratoLocaçãoConsultada } = useContext(ContextoInquilino);
  const [dados, setDados] = useState({ 
    título: contratoLocaçãoConsultada?.título || "",
    status: contratoLocaçãoConsultada?.status || "",
    descrição_casa: contratoLocaçãoConsultada?.descrição_casa || "",
    data_fim: contratoLocaçãoConsultada?.data_fim || "",
    valor_mensal: contratoLocaçãoConsultada?.valor_mensal || "",
    finalizada: contratoLocaçãoConsultada?.finalizada || false,
    dia_pagamento: contratoLocaçãoConsultada?.dia_pagamento || "",
    endereço: contratoLocaçãoConsultada?.endereço || "",
    bairro: contratoLocaçãoConsultada?.bairro || ""});
  const [listaBairros, setListaBairros] = useState([]);
  const [erros, setErros] = useState({});
  const navegar = useNavigate();
  const opçõesCategoriaMoradia = [{ label: "Casa", value: "Casa" },
    { label: "Apartamento", value: "Apartamento" },
    { label: "Kitnet", value: "Kitnet" }];

    
  function alterarEstado(event) {
  const { name, value, checked, type } = event.target;
  let valor;

  if (type === "checkbox") valor = checked;
  else valor = value;

  setDados({ ...dados, [name]: valor });
};
  function mostrarImóveisAluguel() { navegar("../pesquisar-imoveis-aluguel"); };

  function validarCampos() {
    const { título, status, descrição_casa, data_fim, valor_mensal,dia_pagamento, bairro, endereço  } = dados;
    let errosCamposObrigatórios = validarCamposObrigatórios({ 
        valor_mensal,
        status,
        data_fim,
        dia_pagamento,
        descrição_casa,
        título,
        endereço,
        bairro });
    setErros(errosCamposObrigatórios);
    return checarListaVazia(errosCamposObrigatórios);
  };
  function retornarAdministrarContratosLocação() { navegar("../administrar-contratos-locacao"); };
  async function cadastrarContratoLocação() {
    if (validarCampos()) {
      try {
        console.log("chamou a função");
        await serviçoCadastrarContratoLocação({ ...dados, cpf: usuárioLogado.cpf });
        mostrarToast(referênciaToast, "Proposta cadastrada com sucesso!", "sucesso");
        console.log("voltou da função");
      } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "error"); }
    }
  };
  async function alterarContratoLocação() {
    if (validarCampos()) {
      try {
        await serviçoAlterarContratoLocação({ ...dados, id: contratoLocaçãoConsultada.id });
        mostrarToast(referênciaToast, "Proposta alterada com sucesso!", "sucesso");
      } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "error"); }
    }
  };
  
  async function removerContratoLocação() {
    try {
      await serviçoRemoverContratoLocação(contratoLocaçãoConsultada.id);
      mostrarToast(referênciaToast, "Proposta excluída com sucesso!", "sucesso");
    } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "error"); }
  };
   function BotõesAções() {
    if (contratoLocaçãoConsultada) {
      return (
        <div className={estilizarInlineFlex()}>
          <Button className={estilizarBotãoRetornar()} label="Retornar" onClick={retornarAdministrarContratosLocação}/>
          <Button className={estilizarBotãoRemover()} label="Remover" onClick={removerContratoLocação}/>
          <Button className={estilizarBotão()} label="Alterar" onClick={alterarContratoLocação}/>
          <Button className={estilizarBotão()} label="Interesses" onClick={mostrarImóveisAluguel
           }/>
        </div>
      );
    } else {
      return (
        <div className={estilizarInlineFlex()}>
          <Button className={estilizarBotãoRetornar()} label="Retornar" 
             onClick={retornarAdministrarContratosLocação}/>
          <Button className={estilizarBotão()} label="Cadastrar" onClick={cadastrarContratoLocação}/>
        </div>
      );
    }
  };
  function títuloFormulário() {
    if (contratoLocaçãoConsultada) return "Alterar Proposta";
    else return "Cadastrar Proposta";
  };
  useEffect(() => {
    async function buscarBairroContratoLocação() {
      try {
        const response = await serviçoBuscarBairroContratos();
        if (response.data) setListaBairros(response.data);
      } catch (error) {
        const erro = error.response.data.erro;
        if (erro) mostrarToast(referênciaToast, erro, "error"); }
    }
    buscarBairroContratoLocação();
  }, [])
  return (
    <div className={estilizarFlex()}>
      <Toast ref={referênciaToast} onHide={retornarAdministrarContratosLocação} position="bottom-center"/>
      <Card title={títuloFormulário()} className={estilizarCard(usuárioLogado.cor_tema)}>
        
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Título*:</label>
          <InputText name="título"
            className={estilizarInputText(erros.título, 400, usuárioLogado.cor_tema)}
            value={dados.título} onChange={alterarEstado}/>
          <MostrarMensagemErro mensagem={erros.título}/>
        </div>

        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Opções de categoria de moradia*:</label>
          <Dropdown name="status"
            className={estilizarDropdown(erros.status, usuárioLogado.cor_tema)}
            value={dados.status} options={opçõesCategoriaMoradia} onChange={alterarEstado} 
            placeholder="-- Selecione --"/>
          <MostrarMensagemErro mensagem={erros.status}/>
        </div>

        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
             Selecione um bairro já cadastrado:</label>
          <Dropdown name="bairro" placeholder="-- Selecione --" showClear
            className={estilizarDropdown(erros.bairro, usuárioLogado.cor_tema)} filter
            options={listaBairros} onChange={alterarEstado}
            emptyMessage={"Nenhuma área cadastrada."}/>
            <MostrarMensagemErro mensagem={erros.bairro} />
        </div>

        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Insira um bairro manualmente:</label>
          <InputText name="bairro"
            className={estilizarInputText(erros.bairro, 200, usuárioLogado.cor_tema)}
            value={dados.bairro} onChange={alterarEstado}/>
          <MostrarMensagemErro mensagem={erros.bairro}/>
        </div>

        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Data de fim do contrato*:</label>
           <InputText name="data_fim" type="date" value={dados.data_fim} 
            className={estilizarInputText(erros.data_fim, usuárioLogado.cor_tema)}
            onChange={alterarEstado}/>
          <MostrarMensagemErro mensagem={erros.data_fim}/>
        </div>

            <div className={estilizarDivCampo()}>
                  <label className={estilizarLabel(usuárioLogado.cor_tema)}>Dia do pagamento do aluguel (dia 1 ao 28)*:</label>
                  <InputNumber name="dia_pagamento"
                    size={5}
                    value={dados.dia_pagamento}
                    className={estilizarInputNumber(erros.dia_pagamento, usuárioLogado.cor_tema)}
                    onValueChange={alterarEstado}
                    mode="decimal"
                    min={1}
                    max={28}
                  />
                  <MostrarMensagemErro mensagem={erros.dia_pagamento} />
              </div>

        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Descrição das regras da casa*:</label>
          <InputTextarea name="descrição_casa" 
            value={dados.descrição_casa}
            className={estilizarInputTextarea(erros.descrição_casa, usuárioLogado.cor_tema)} 
            onChange={alterarEstado} 
            autoResize cols={40}/>
          <MostrarMensagemErro mensagem={erros.descrição_casa}/>
        </div>

        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Endereço da casa*:</label>
          <InputTextarea name="endereço" 
            value={dados.endereço}
            className={estilizarInputTextarea(erros.endereço, usuárioLogado.cor_tema)} 
            onChange={alterarEstado} 
            autoResize cols={40}/>
          <MostrarMensagemErro mensagem={erros.endereço}/>
        </div>

            <div className={estilizarDivCampo()}>
                  <label className={estilizarLabel(usuárioLogado.cor_tema)}>Valor mensal do aluguel (R$)*:</label>
                  <InputNumber name="valor_mensal"
                    size={5}
                    value={dados.valor_mensal}
                    className={estilizarInputNumber(erros.valor_mensal, usuárioLogado.cor_tema)}
                    onValueChange={alterarEstado}
                    mode="decimal"
                  />
                  <MostrarMensagemErro mensagem={erros.valor_mensal} />
              </div>

        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Finalizada ?*:</label>
          <Checkbox name="finalizada" checked={dados.finalizada}
            className={estilizarCheckbox()} onChange={alterarEstado} autoResize/>
            <MostrarMensagemErro mensagem={erros.finalizada} />
        </div>

        <Divider className={estilizarDivider()}/>
        <BotõesAções/>
      </Card>
    </div>
  );
 }