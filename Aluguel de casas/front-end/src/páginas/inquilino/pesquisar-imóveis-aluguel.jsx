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
 import ContextoInquilino from "../../contextos/contexto-inquilino";
 import mostrarToast from "../../utilitários/mostrar-toast";
 import { serviçoBuscarImóveisAluguelContratoLocação } from "../../serviços/serviços-inquilino";
 import { TAMANHOS, estilizarBotãoRetornar, estilizarBotãoTabela, estilizarCard, 
  estilizarColumnHeader, estilizarColunaConsultar, estilizarDataTable, estilizarDataTablePaginator, 
  estilizarDivider, estilizarFilterMenu, estilizarFlex, estilizarTriStateCheckbox }
  from "../../utilitários/estilos";
 export default function PesquisarImóveisAluguel() {
  const referênciaToast = useRef(null);
  const { usuárioLogado } = useContext(ContextoUsuário);
  const { 
    imóvelAluguelConsultado,
    setImóvelAluguelConsultado,
    contratoLocaçãoConsultada } = useContext(ContextoInquilino);
  const [listaImóveisAluguel, setListaImóveisAluguel] = useState([]);
  const navegar = useNavigate();
  const opçõesCategoria = [
    { label: "Casa", value: "Kitnet" },
    { label: "Apartamento", value: "Apartamento" },
    { label: "Kitnet", value: "Kitnet" }];
  function retornarCadastrarContratoLocação() {
    setImóvelAluguelConsultado(null);
    navegar("../cadastrar-contrato-locacao");
  };
  function ConsultarTemplate(interesse) {
    return (
      <Button icon="pi pi-search"
        className={estilizarBotãoTabela(usuárioLogado.cor_tema,
          imóvelAluguelConsultado?.id === interesse.id)}
          
        tooltip="Consultar interesse" tooltipOptions={{ position: 'top' }}
        onClick={() => {
          setImóvelAluguelConsultado(interesse);
          navegar("../consultar-imovel-aluguel");;
      }}/>
    );
    
  };
  function DropdownÁreaTemplate(opções) {
    function alterarFiltroDropdown(event) {
      return opções.filterCallback(event.value, opções.index); };
    return <Dropdown value={opções.value} options={opçõesCategoria} placeholder="Selecione"
      onChange={alterarFiltroDropdown} showClear />;
  };
   function BooleanBodyTemplate(interesse) {
    if (interesse.mobília_inclusa) return "Sim";
    else return "Não";
  };
  
  function BooleanFilterTemplate(opções) {
    function alterarFiltroTriState(event) { return opções.filterCallback(event.value); };
    return (
      <div>
        <label>Mobília Inclusa? :</label>
        <TriStateCheckbox
          className={estilizarTriStateCheckbox(usuárioLogado?.cor_tema)} value={opções.value}
          onChange={alterarFiltroTriState}/>
      </div>
    );
  };  
  useEffect(() => {
    let desmontado = false;
    async function buscarImóveisAluguelContratoLocação() {
      try {
        const response = await serviçoBuscarImóveisAluguelContratoLocação(contratoLocaçãoConsultada?.id);
        if (!desmontado && response.data) setListaImóveisAluguel(response.data);
      } catch (error) { mostrarToast(referênciaToast, error.response.data.erro, "error"); }
    };
    buscarImóveisAluguelContratoLocação();
    return () => desmontado = true;
  }, [contratoLocaçãoConsultada?.id]);
  return ( 
    <div className={estilizarFlex()}>
      <Toast ref={referênciaToast} position="bottom-center"/>
      <Card title="Interesses Cadastrados" className={estilizarCard(usuárioLogado.cor_tema)}>
      <DataTable dataKey="id" size="small" paginator rows={TAMANHOS.MAX_LINHAS_TABELA}
          emptyMessage="Nenhum interesse encontrado." value={listaImóveisAluguel} 
          responsiveLayout="scroll" breakpoint="490px" removableSort 
          className={estilizarDataTable()}
          paginatorClassName={estilizarDataTablePaginator(usuárioLogado.cor_tema)}>
          <Column bodyClassName={estilizarColunaConsultar()} body={ConsultarTemplate}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}/>
          <Column field="morador_adicional.usuário.nome" header="Morador" filter showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable/>
          <Column field="contrato.título" header="Proposta" filter showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable/>
          <Column headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            field="contrato.categoria" header="Categoria" filter filterMatchMode="equals"
            filterElement={DropdownÁreaTemplate} showClearButton={false}
            showFilterOperator={false} showFilterMatchModes={false}
            filterMenuClassName={estilizarFilterMenu()} showFilterMenuOptions={false} sortable />
          <Column field="mobília_inclusa" header="Mobília Inclusa" dataType="boolean" filter 
            showFilterOperator={false} body={BooleanBodyTemplate} 
            filterElement={BooleanFilterTemplate} filterMatchMode="equals"
            showClearButton={false} showAddButton={false} 
            filterMenuClassName={estilizarFilterMenu()}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)} sortable/>          
        </DataTable>
        <Divider className={estilizarDivider()}/>
        <Button className={estilizarBotãoRetornar()} label="Retornar" 
           onClick={retornarCadastrarContratoLocação}/>
      </Card>
    </div>
  );
 }