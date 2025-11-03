import { useContext, useEffect, useRef, useState } from "react";
 import { useNavigate } from "react-router-dom";
 import { Button } from "primereact/button";
 import { Card } from "primereact/card";
 import { Column } from "primereact/column";
 import { DataTable } from "primereact/datatable";
 import { Divider } from "primereact/divider";
 import { Dropdown } from "primereact/dropdown";
 import { Toast } from "primereact/toast";
 import { TriStateCheckbox } from "primereact/tristatecheckbox";
 import ContextoUsuário from "../../contextos/contexto-usuário";
 import ContextoMoradorAdicional from "../../contextos/contexto-morador-adicional";
 import { serviçoBuscarContratosLocação } from "../../serviços/serviços-morador-adicional";
 import mostrarToast from "../../utilitários/mostrar-toast";
 import { TAMANHOS, estilizarBotãoRetornar, estilizarBotãoTabela, estilizarCard, 
  estilizarColumnHeader, estilizarColunaConsultar, estilizarDataTable, estilizarDataTablePaginator, 
  estilizarDivider, estilizarFilterMenu, estilizarFlex, estilizarTriStateCheckbox }
  from "../../utilitários/estilos";
 export default function PesquisarContratosLocação() {
  const referênciaToast = useRef(null);
  const { usuárioLogado } = useContext(ContextoUsuário);
  const { contratoLocaçãoConsultada, setContratoLocaçãoConsultada, setContratoLocaçãoSelecionada }
     = useContext(ContextoMoradorAdicional);
  const [listaContratos, setListaContratos] = useState([]);
  const navegar = useNavigate();
  const opçõesInteresse = [{ label: "Alto", value: "Alto" },
    { label: "Médio", value: "Médio" },
    { label: "Baixo", value: "Baixo" },
    { label: "Urgente", value: "Urgente"}];
    
  function retornarCadastrarImóvelAluguel() {
    setContratoLocaçãoSelecionada(contratoLocaçãoConsultada);
    setContratoLocaçãoConsultada(null);
    navegar("../cadastrar-imovel-aluguel");
  };
  function ConsultarTemplate(proposta) {
    return (
      <Button icon="pi pi-search"
         className={estilizarBotãoTabela(usuárioLogado.cor_tema,
            contratoLocaçãoConsultada?.id === proposta.id)}
         tooltip="Consultar Proposta" tooltipOptions={{ position: 'top' }}
         onClick={() => {
            setContratoLocaçãoConsultada(proposta);
            navegar("../consultar-contrato-locacao");;
         }}/>
    );
  };
  function DropdownÁreaTemplate(opções) {
    function alterarFiltroDropdown(event) {
       return opções.filterCallback(event.value, opções.index);
    };
    return <Dropdown value={opções.value} options={opçõesInteresse} placeholder="Selecione"
      onChange={alterarFiltroDropdown} showClear />;
  };
  function BooleanBodyTemplate(proposta) {
    if (proposta.finalizada) return "Sim";
    else return "Não";
  };
  
  function BooleanFilterTemplate(opções) {
    function alterarFiltroTriState(event) { return opções.filterCallback(event.value); };
    return (
      <div>
        <label> Proposta finalizada? :</label>
        <TriStateCheckbox
          className={estilizarTriStateCheckbox(usuárioLogado?.cor_tema)} value={opções.value}
          onChange={alterarFiltroTriState}/>
      </div>
    );
  };
  useEffect(() => {
    let desmontado = false;
    async function buscarContratosLocação() {
      try {
        const response = await serviçoBuscarContratosLocação();
        if (!desmontado && response.data) setListaContratos(response.data);
      } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "error"); }
    };
    buscarContratosLocação();
    return () => desmontado = true;
  }, [usuárioLogado.cpf]);
   return ( 
    <div className={estilizarFlex()}>
      <Toast ref={referênciaToast} position="bottom-center"/>
      <Card title="Pesquisar Propostas" className={estilizarCard(usuárioLogado.cor_tema)}>
        <DataTable dataKey="id" size="small" paginator rows={TAMANHOS.MAX_LINHAS_TABELA}
          emptyMessage="Nenhuma proposta encontrada." value={listaContratos} 
          responsiveLayout="scroll" breakpoint="490px" removableSort 
          className={estilizarDataTable()}
          paginatorClassName={estilizarDataTablePaginator(usuárioLogado.cor_tema)}>
          <Column bodyClassName={estilizarColunaConsultar()} body={ConsultarTemplate}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}/>
          <Column field="inquilino.usuário.nome" header="Nome do Inquilino" filter 
            showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable/>
          <Column field="título" header="Título" filter showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable/>
          <Column field="endereço" header="Endereço" filter showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable/>
          <Column headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            field="status" header="Status de Interesse" filter filterMatchMode="equals"
            filterElement={DropdownÁreaTemplate} showClearButton={false}
            showFilterOperator={false} showFilterMatchModes={false}
            filterMenuClassName={estilizarFilterMenu()} showFilterMenuOptions={false} sortable />
          <Column field="bairro" header="Bairro" filter showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable/>
          <Column field="finalizada" header=" Proposta Finalizada?" dataType="boolean" filter 
            showFilterOperator={false}
            body={BooleanBodyTemplate} filterElement={BooleanFilterTemplate} 
            filterMatchMode="equals" showClearButton={false} showAddButton={false} 
            filterMenuClassName={estilizarFilterMenu()}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable/>
        </DataTable>
        <Divider className={estilizarDivider()}/>
        <Button className={estilizarBotãoRetornar()} label="Retornar" 
           onClick={retornarCadastrarImóvelAluguel}/>
      </Card>
    </div>
  );
 }