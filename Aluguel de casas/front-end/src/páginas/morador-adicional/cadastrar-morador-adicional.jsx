import { useContext, useEffect, useRef, useState } from "react";
 import { useNavigate } from "react-router-dom";
 import { Button } from "primereact/button";
 import { Card } from "primereact/card";
 import { Divider } from "primereact/divider";
 import { Dropdown } from "primereact/dropdown";
 import { InputMask } from "primereact/inputmask";
 import { InputText } from "primereact/inputtext";
 import { Checkbox } from "primereact/checkbox";
 import { Toast } from "primereact/toast";
 import ContextoUsuário from "../../contextos/contexto-usuário";
 import { ANO_MÁSCARA, TELEFONE_MÁSCARA } from "../../utilitários/máscaras";
 import { serviçoCadastrarMoradorAdicional, serviçoAtualizarMoradorAdicional, serviçoBuscarMoradorAdicional }
  from "../../serviços/serviços-morador-adicional";
 import mostrarToast from "../../utilitários/mostrar-toast";
 import { MostrarMensagemErro, checarListaVazia, validarCamposObrigatórios }
  from "../../utilitários/validações";
 import { TAMANHOS, estilizarBotão, estilizarBotãoRetornar, estilizarCard, estilizarDivCampo, 
  estilizarDivider, estilizarDropdown, estilizarFlex, estilizarInlineFlex, estilizarInputMask,   
  estilizarInputText, estilizarLabel } from "../../utilitários/estilos";
 export default function CadastrarMoradorAdicional() {
  const referênciaToast = useRef(null);
  const { usuárioLogado, setUsuárioLogado } = useContext(ContextoUsuário);
  const [dados, setDados] = useState({ rotina: "", ano_ingresso: "", precisa_cuidado: false});
  const [erros, setErros] = useState({});
  const [cpfExistente, setCpfExistente] = useState(false);
  const navegar = useNavigate();
  const opçõesRotina = [{ label: "Diurna", value: "Diurna" },
    { label: "Noturna", value: "Noturna" }];
  function alterarEstado(event) {
    const chave = event.target.name || event.value;
    const valor = event.target.value;
    setDados({ ...dados, [chave]: valor });
  };
  function validarCampos() {
    let errosCamposObrigatórios;
    errosCamposObrigatórios = validarCamposObrigatórios(dados);
    setErros(errosCamposObrigatórios);
    return checarListaVazia(errosCamposObrigatórios);
  };
  function títuloFormulário() {
    if (usuárioLogado?.cadastrado) return "Alterar Morador Adicional";
    else return "Cadastrar Morador Adicional";
  };
  async function cadastrarMoradorAdicional() {
    if (validarCampos()) {
      try {
        const response = await serviçoCadastrarMoradorAdicional({ ...dados, usuário_info: usuárioLogado,
          rotina: dados.rotina, ano_ingresso: dados.ano_ingresso,
          precisa_cuidado: dados.precisa_cuidado });
        if (response.data)
          setUsuárioLogado(usuário => ({ ...usuário, status: response.data.status,
            token: response.data.token }));
        mostrarToast(referênciaToast, "Morador Adicional cadastrado com sucesso!", "sucesso");
      } catch (error) {
        setCpfExistente(true);
        mostrarToast(referênciaToast, error.response.data.erro, "erro"); 
      }
    }
  };
  async function atualizarMoradorAdicional() {
    if (validarCampos()) {
      try {
        const response = await serviçoAtualizarMoradorAdicional({ ...dados, cpf: usuárioLogado.cpf });
        if (response) mostrarToast(referênciaToast,"Morador adicional atualizado com sucesso!", "sucesso");
      } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "erro"); }
    }
  };
  function labelBotãoSalvar() {
    if (usuárioLogado?.cadastrado) return "Alterar";
    else return "Cadastrar";
  };
  function açãoBotãoSalvar() {
    if (usuárioLogado?.cadastrado) atualizarMoradorAdicional();
    else cadastrarMoradorAdicional();
  };
   function redirecionar() {
    if (cpfExistente) {
      setUsuárioLogado(null);
      navegar("/criar-usuario");
    } else {
      setUsuárioLogado(usuárioLogado => ({ ...usuárioLogado, cadastrado: true }));
      navegar("/pagina-inicial");
    }
  };
  useEffect(() => {
    let desmontado = false;
    async function buscarDadosMoradorAdicional() {
      try {
        const response = await serviçoBuscarMoradorAdicional(usuárioLogado.cpf);
        if (!desmontado && response.data) {
          setDados(dados => ({ ...dados, rotina: response.data.rotina,
            ano_ingresso: response.data.ano_ingresso,
            precisa_cuidado: response.data.precisa_cuidado }));
        }
      } catch (error) {
        const erro = error.response.data.erro;
        if (erro) mostrarToast(referênciaToast, erro, "erro");
      }
    }
    if (usuárioLogado?.cadastrado) buscarDadosMoradorAdicional();
    return () => desmontado = true;
  }, [usuárioLogado?.cadastrado, usuárioLogado.cpf]);
  return (
    <div className={estilizarFlex()}>
    <Toast ref={referênciaToast} onHide={redirecionar} position="bottom-center"/>
    <Card title={títuloFormulário()} className={estilizarCard(usuárioLogado.cor_tema)}>
      <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(usuárioLogado.cor_tema)}>Rotina*:</label>
        <Dropdown name="rotina" className={estilizarDropdown(erros.rotina, usuárioLogado.cor_tema)}
            value={dados.rotina} options={opçõesRotina} onChange={alterarEstado}
            placeholder="-- Selecione --"/>        
        
        <MostrarMensagemErro mensagem={erros.rotina}/>
      </div>
      <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(usuárioLogado.cor_tema)}>Ano de Ingresso na Faculade*:</label>
        <InputMask name="ano_ingresso" autoClear size={TAMANHOS.ANO} onChange={alterarEstado}
          className={estilizarInputMask(erros.ano_ingresso, usuárioLogado.cor_tema)}
          mask={ANO_MÁSCARA} value={dados.ano_ingresso}/>
        <MostrarMensagemErro mensagem={erros.ano_ingresso}/>
      </div>
      <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(usuárioLogado.cor_tema)}>Precisa de Cuidado Especial?*:</label>
          <Checkbox
            inputId="precisa_cuidado"
            name="precisa_cuidado"
            checked={dados.precisa_cuidado === true}
            onChange={(e) =>
            setDados({ ...dados, precisa_cuidado: e.checked })
            }
            className={estilizarInputText(erros.precisa_cuidado, usuárioLogado.cor_tema)}/>
            
          <MostrarMensagemErro mensagem={erros.precisa_cuidado}/>
      </div>


      <Divider className={estilizarDivider(dados.cor_tema)}/>
      <div className={estilizarInlineFlex()}>
        <Button className={estilizarBotãoRetornar()} label="Retornar" onClick={redirecionar} />
        <Button className={estilizarBotão()} label={labelBotãoSalvar()} onClick={açãoBotãoSalvar}/>
      </div>
      </Card>
    </div>
  );
 };
