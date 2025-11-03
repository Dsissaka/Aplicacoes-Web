import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Checkbox } from "primereact/checkbox";
import { Toast } from "primereact/toast";

import ContextoUsuário from "../../contextos/contexto-usuário";
import {
  serviçoCadastrarInquilino,
  serviçoBuscarInquilino,
  serviçoAtualizarInquilino,
} from "../../serviços/serviços-inquilino";
import mostrarToast from "../../utilitários/mostrar-toast";
import {
  MostrarMensagemErro,
  checarListaVazia,
  validarCamposObrigatórios,
} from "../../utilitários/validações";
import {
  estilizarBotão,
  estilizarBotãoRetornar,
  estilizarCard,
  estilizarDivCampo,
  estilizarDivider,
  estilizarDropdown,
  estilizarFlex,
  estilizarInlineFlex,
  estilizarInputNumber,
  estilizarLabel,
} from "../../utilitários/estilos";

export default function CadastrarInquilino() {
  const referênciaToast = useRef(null);
  const { usuárioLogado, setUsuárioLogado } = useContext(ContextoUsuário);
  const [dados, setDados] = useState({
    tipo: "",
    tempo_alugando: "",
    fumante: false,
    profissão: "",
    descrição_pessoal: "",
  });
  const [erros, setErros] = useState({});
  const [cpfExistente, setCpfExistente] = useState(false);
  const navegar = useNavigate();

  const opçõesTipo = [
    { label: "Universitário", value: "universitário" },
    { label: "Não Universitário", value: "não_universitário" },
  ];

  function alterarEstado(event) {
    const chave = event.target.name || event.value;
    const valor = event.target.value;
    setDados({ ...dados, [chave]: valor });
  }

  function validarCampos() {
    const camposObrigatórios = ["tipo", "tempo_alugando"];
    const errosCamposObrigatórios = validarCamposObrigatórios(dados, camposObrigatórios);
    setErros(errosCamposObrigatórios);
    return checarListaVazia(errosCamposObrigatórios);
  }

  async function cadastrarInquilino() {
    if (validarCampos()) {
      try {
        const response = await serviçoCadastrarInquilino({
          ...dados,
          usuário_info: usuárioLogado,
        });

        if (response.data) {
          setUsuárioLogado((usuário) => ({
            ...usuário,
            status: response.data.status,
            token: response.data.token,
          }));
          mostrarToast(referênciaToast, "Inquilino cadastrado com sucesso!", "sucesso");
        }
      } catch (error) {
        setCpfExistente(true);
        const erro = error.response?.data?.erro;
        const mensagem =
          typeof erro === "string"
            ? erro
            : erro?.sqlMessage || "Erro inesperado ao cadastrar inquilino.";
        mostrarToast(referênciaToast, mensagem, "erro");
      }
    }
  }

  function redirecionar() {
    if (cpfExistente) {
      setUsuárioLogado(null);
      navegar("/criar-usuario");
    } else {
      setUsuárioLogado((usuárioLogado) => ({
        ...usuárioLogado,
        cadastrado: true,
      }));
      navegar("/pagina-inicial");
    }
  }
  async function atualizarInquilino() {
    if (validarCampos()) {
      try {
        const response = await serviçoAtualizarInquilino({ ...dados, cpf: usuárioLogado.cpf });
        if (response) mostrarToast(referênciaToast, "Inquilino atualizado com sucesso!", "sucesso");
      } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "erro"); }
    }
  };

  function labelBotãoSalvar() {
    if (usuárioLogado?.cadastrado) return "Alterar";
    else return "Cadastrar";
  };

  function açãoBotãoSalvar() {
    if (usuárioLogado?.cadastrado) atualizarInquilino();
    else cadastrarInquilino();
  };

  useEffect(() => {
    let desmontado = false;

    async function buscarDadosInquilino() {
      try {
        const response = await serviçoBuscarInquilino(usuárioLogado.cpf);
        if (!desmontado && response.data) {
          setDados((dados) => ({
            ...dados,
            tipo: response.data.tipo,
            tempo_alugando: response.data.tempo_alugando,
            fumante: response.data.fumante,
            profissão: response.data.profissão,
            descrição_pessoal: response.data.descrição_pessoal,
          }));
        }
      } catch (error) {
        const erro = error.response?.data?.erro;
        const mensagem =
          typeof erro === "string"
            ? erro
            : erro?.sqlMessage || "Erro ao buscar dados do inquilino.";
        mostrarToast(referênciaToast, mensagem, "erro");
      }
    }

    if (usuárioLogado?.cadastrado) buscarDadosInquilino();

    return () => {
      desmontado = true;
    };
  }, [usuárioLogado?.cadastrado, usuárioLogado.cpf]);

  return (
    <div className={estilizarFlex()}>
      <Toast ref={referênciaToast} onHide={redirecionar} position="bottom-center" />
      <Card title={usuárioLogado?.cadastrado ? "Consultar Inquilino" : "Cadastrar Inquilino"} className={estilizarCard(usuárioLogado.cor_tema)}>
        {/* Tipo */}
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Tipo*:</label>
          <Dropdown
            name="tipo"
            className={estilizarDropdown(erros.tipo, usuárioLogado.cor_tema)}
            value={dados.tipo}
            options={opçõesTipo}
            onChange={alterarEstado}
            placeholder="-- Selecione --"
          />
          <MostrarMensagemErro mensagem={erros.tipo} />
        </div>

        {/* Tempo alugando */}
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Tempo alugando casas (meses)*:</label>
          <InputNumber
            name="tempo_alugando"
            size={5}
            value={dados.tempo_alugando}
            onValueChange={alterarEstado}
            mode="decimal"
            inputClassName={estilizarInputNumber(erros.tempo_alugando, usuárioLogado.cor_tema)}
          />
          <MostrarMensagemErro mensagem={erros.tempo_alugando} />
        </div>

        {/* Fumante */}
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Fumante:</label>
          <Checkbox
            name="fumante"
            checked={dados.fumante}
            onChange={(e) => setDados({ ...dados, fumante: e.checked })}
          />
        </div>

        {/* Profissão */}
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Profissão:</label>
          <InputText
            name="profissão"
            value={dados.profissão}
            onChange={alterarEstado}
            className={erros.profissão ? "p-invalid" : ""}
          />
          <MostrarMensagemErro mensagem={erros.profissão} />
        </div>

        {/* Descrição pessoal */}
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>Descrição pessoal:</label>
          <InputTextarea
            name="descrição_pessoal"
            value={dados.descrição_pessoal}
            onChange={alterarEstado}
            rows={4}
            cols={30}
          />
        </div>

        <Divider className={estilizarDivider(dados.cor_tema)} />

        <div className={estilizarInlineFlex()}>
          <Button className={estilizarBotãoRetornar()} label="Retornar" onClick={redirecionar} />
          <Button className={estilizarBotão()} label={labelBotãoSalvar()} onClick={açãoBotãoSalvar}/>
        </div>
      </Card>
    </div>
  );
}