 import { useContext, useEffect, useRef, useState } from "react";
 import { useNavigate } from "react-router-dom";
 import { Button } from "primereact/button";
 import { Card } from "primereact/card";
 import { Divider } from "primereact/divider";
 import { Dropdown } from "primereact/dropdown";
 import { InputNumber } from "primereact/inputnumber";
 import { Toast } from "primereact/toast";
 import ContextoUsuário from "../../contextos/contexto-usuário";
 import { serviçoCadastrarInquilino, serviçoBuscarInquilino }
  from "../../serviços/serviços-professor";
 import mostrarToast from "../../utilitários/mostrar-toast";
 import { MostrarMensagemErro, checarListaVazia, validarCamposObrigatórios }
  from "../../utilitários/validações";
  import {estilizarBotão, estilizarBotãoRetornar, estilizarCard, estilizarDivCampo, estilizarDivider, 
  estilizarDropdown, estilizarFlex, estilizarInlineFlex, estilizarInputNumber, estilizarLabel }
  from "../../utilitários/estilos";
import { serviçoCadastrarInquilino } from "../../serviços/serviços-inquilino";
 export default function CadastrarInquilino() {
  const referênciaToast = useRef(null);
  const { usuárioLogado, setUsuárioLogado } = useContext(ContextoUsuário);
  const [dados, setDados] = useState({ categoria: "", tempo_alugando: "" });
  const [erros, setErros] = useState({});
  const [cpfExistente, setCpfExistente] = useState(false);
  const navegar = useNavigate();
  const opçõesCategoria = [{ label: "Casa", value: "casa" },
    { label: "Apartamento", value: "apartamento" }];
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
    if (usuárioLogado?.cadastrado) return "Consultar Inquilino";
    else return "Cadastrar Inquilino";
  };
  async function cadastrarInquilino() {
    if (validarCampos()) {
      try {
        const response = await serviçoCadastrarInquilino({ ...dados, usuário_info: usuárioLogado,
          titulação: dados.titulação,
          tempo_alugando: dados.tempo_alugando });
        if (response.data)
          setUsuárioLogado(usuário => ({ ...usuário, status: response.data.status,
            token: response.data.token }));
        mostrarToast(referênciaToast, "Inquilino cadastrado com sucesso!", "sucesso");
      } catch (error) {
        setCpfExistente(true);
        mostrarToast(referênciaToast, error.response.data.erro, "erro"); 
      }
    }
  };
  function labelBotãoSalvar() {
    if (usuárioLogado?.cadastrado) return "Consultar";
    else return "Cadastrar";
  };
  function açãoBotãoSalvar() {
    if (!usuárioLogado?.cadastrado) cadastrarInquilino();
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
    async function buscarDadosInquilino() {
      try {
        const response = await serviçoBuscarInquilino(usuárioLogado.cpf);
        if (!desmontado && response.data) {
          setDados(dados => ({ ...dados, titulação: response.data.titulação,
            tempo_alugando: response.data.tempo_alugando }));
        }
      } catch (error) {
        const erro = error.response.data.erro;
        if (erro) mostrarToast(referênciaToast, erro, "erro");
      }
    }
    if (usuárioLogado?.cadastrado) buscarDadosInquilino();
    return () => desmontado = true;
  }, [usuárioLogado?.cadastrado, usuárioLogado.cpf]); 
  return (
    <div className={estilizarFlex()}>
    <Toast ref={referênciaToast} onHide={redirecionar} position="bottom-center"/>
    <Card title={títuloFormulário()} className={estilizarCard(usuárioLogado.cor_tema)}>
      <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(usuárioLogado.cor_tema)}>Categoria*:</label>
        <Dropdown name="categoria"
            className={estilizarDropdown(erros.categoria, usuárioLogado.cor_tema)}
            value={dados.categoria} options={opçõesCategoria} onChange={alterarEstado} 
            placeholder="-- Selecione --"/>        
        <MostrarMensagemErro mensagem={erros.categoria}/>
      </div>
      <div className={estilizarDivCampo()}>
        <label className={estilizarLabel(usuárioLogado.cor_tema)}>
           Anos de Experiência Com Aluguel de Casas*:</label>
        <InputNumber name="tempo_alugando" size={5} 
            value={dados.tempo_alugando} 
            onValueChange={alterarEstado} mode= "decimal"
            inputClassName={estilizarInputNumber(erros.tempo_alugando, 
              usuárioLogado.cor_tema)}/>
        <MostrarMensagemErro mensagem={erros.tempo_alugando}/>
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