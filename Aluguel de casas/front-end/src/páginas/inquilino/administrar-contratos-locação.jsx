 import { useRef, useState, useEffect, useContext } from "react";
 import { useNavigate } from "react-router-dom";
 import { Button } from "primereact/button";
 import { Card } from "primereact/card";
 import { Column } from "primereact/column";
 import { DataTable } from "primereact/datatable";
 import { Divider } from "primereact/divider";
 import { Dropdown } from "primereact/dropdown";
 import { TriStateCheckbox } from "primereact/tristatecheckbox";
 import ContextoInquilino from "../../contextos/contexto-inquilino";
 import ContextoUsuário from "../../contextos/contexto-usuário";
 import { serviçoBuscarContratosLocaçãoInquilino } from "../../serviços/serviços-inquilino";
 import mostrarToast from "../../utilitários/mostrar-toast";
 import { TAMANHOS, estilizarBotão, estilizarBotãoRetornar, estilizarBotãoTabela, estilizarCard, 
  estilizarColunaConsultar, estilizarColumnHeader, estilizarDataTable, estilizarDataTablePaginator, 
  estilizarDivider, estilizarFilterMenu, estilizarFlex, estilizarTriStateCheckbox }
  from "../../utilitários/estilos";
 export default function AdministrarContratosLocação() {
  const referênciaToast = useRef(null);
  const { usuárioLogado } = useContext(ContextoUsuário);
  const { contratoLocaçãoConsultada, setContratoLocaçãoConsultada } = useContext(ContextoInquilino);
  const [listaContratosLocação, setListaContratosLocação] = useState([]);
  const navegar = useNavigate();
  const opçõesCategoriaMoradia = [{ label: "Casa", value: "Casa" },
    { label: "Apartamento", value: "Apartamento" },
    { label: "Kitnet", value: "Kitnet" }];
  function retornarPáginaInicial() { navegar("/pagina-inicial"); };
  function adicionarContratoLocação() {
    setContratoLocaçãoConsultada(null);
    navegar("../cadastrar-contrato-locacao");
  };
  function ConsultarTemplate(proposta) {
    function consultar() {
      setContratoLocaçãoConsultada(proposta);
      navegar("../cadastrar-contrato-locacao");
    };
    return (
      <Button icon="pi pi-search"
      className={estilizarBotãoTabela(usuárioLogado.cor_tema,
         contratoLocaçãoConsultada?.id === proposta.id)}
      tooltip="Consultar Proposta" tooltipOptions={{ position: 'top' }} onClick={consultar}/>
    );
  };
  function DropdownÁreaTemplate(opções) {
    function alterarFiltroDropdown(event)
      { return opções.filterCallback(event.value, opções.index); };
    return <Dropdown value={opções.value} options={opçõesCategoriaMoradia} placeholder="Selecione"
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
        <label>Proposta de contrato finalizada?:</label>
        <TriStateCheckbox
          className={estilizarTriStateCheckbox(usuárioLogado?.cor_tema)} value={opções.value}
          onChange={alterarFiltroTriState}/>
      </div>
    );
  };
  useEffect(() => {
    let desmontado = false;
    async function buscarContratosLocaçãoInquilino() {
      try {
        const response = await serviçoBuscarContratosLocaçãoInquilino(usuárioLogado.cpf);
        if (!desmontado && response.data) { setListaContratosLocação(response.data); }
      } catch (error) {
        const erro = error.response.data.erro;
        if (erro) mostrarToast(referênciaToast, erro, "error");
      }
    };
    buscarContratosLocaçãoInquilino();
    return () => desmontado = true;
  }, [usuárioLogado.cpf]);
  
  return ( 
    <div className={estilizarFlex()}>
      <Card title="Administrar Propostas" className={estilizarCard(usuárioLogado.cor_tema)}>
        <DataTable dataKey="id" size="small" paginator rows={TAMANHOS.MAX_LINHAS_TABELA}
          emptyMessage="Nenhuma proposta encontrada." value={listaContratosLocação} 
          responsiveLayout="scroll" breakpoint="490px" removableSort 
          className={estilizarDataTable()}
          paginatorClassName={estilizarDataTablePaginator(usuárioLogado.cor_tema)}>
          <Column bodyClassName={estilizarColunaConsultar()} body={ConsultarTemplate}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}/>
          <Column field="título" header="Título" filter showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable/>
          <Column headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            field="status" header="Tipo da casa" filter filterMatchMode="equals"
            filterElement={DropdownÁreaTemplate} showClearButton={false}
            showFilterOperator={false} showFilterMatchModes={false}
            filterMenuClassName={estilizarFilterMenu()} showFilterMenuOptions={false} sortable />
          <Column field="valor_mensal" header="Valor da mensalidade" filter showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable/>
            <Column field="endereço" header="Endereço" filter showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable/>
          <Column field="finalizada" header="Proposta já foi finalizada?" filter 
            showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable
            filterMatchMode="equals" filterElement={BooleanFilterTemplate}
            body={BooleanBodyTemplate} showClearButton={false} showAddButton={false}
            filterMenuClassName={estilizarFilterMenu()} dataType="boolean"/>
        </DataTable>
        <Divider className={estilizarDivider()}/>
        <Button className={estilizarBotãoRetornar()} label="Retornar"    
           onClick={retornarPáginaInicial}/>
        <Button className={estilizarBotão()} label="Adicionar" onClick={adicionarContratoLocação}/>
      </Card>
    </div>
  );
 }