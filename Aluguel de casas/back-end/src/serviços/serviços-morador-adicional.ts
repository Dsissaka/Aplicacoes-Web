 import md5 from "md5";
 import { getManager } from "typeorm";
 import Usuário, { Status } from "../entidades/usuário";
 import MoradorAdicional from '../entidades/morador-adicional';
 import ServiçosUsuário from "./serviços-usuário";
 import ContratoLocação from "../entidades/contrato-locação";
 import ImóvelAluguel from "../entidades/imóvel-aluguel";
 export default class ServiçosMoradorAdicional { 
  constructor() {}
  static async cadastrarMoradorAdicional(request, response) {
    try {
      const { usuário_info, rotina, ano_ingresso, precisa_cuidado } = request.body;
      const { usuário, token } = await ServiçosUsuário.cadastrarUsuário(usuário_info);
      const entityManager = getManager();
      await entityManager.transaction(async (transactionManager) => {
        await transactionManager.save(usuário);
        const morador = MoradorAdicional.create({ usuário, rotina, ano_ingresso, precisa_cuidado });
        await transactionManager.save(morador);
        await transactionManager.update(Usuário, usuário.cpf, { status: Status.ATIVO });
        return response.json({ status: Status.ATIVO, token });
      });
    } catch (error) { return response.status(500).json({ erro: error }); }
  };
  static async atualizarMoradorAdicional(request, response) {
    try {
      const { cpf, rotina, ano_ingresso, precisa_cuidado } = request.body;
      const cpf_encriptado = md5(cpf);
      await MoradorAdicional.update({ usuário: { cpf: cpf_encriptado } }, { rotina, ano_ingresso, 
        precisa_cuidado });
      return response.json();
    } catch (error) { return response.status(500).json({ erro: "Erro BD : atualizarMoradorAdicional" }); }
  };
  static async buscarMoradorAdicional(request, response) {
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const morador = await MoradorAdicional.findOne({ where: { usuário: cpf_encriptado },
        relations: ["usuário"] });
      if (!morador) return response.status(404).json({ erro: "Morador Adicional não encontrado." });
      return response.json({ 
        nome: morador.usuário.nome,
        email: morador.usuário.email,
        rotina: morador.rotina,  
        ano_ingresso: morador.ano_ingresso,
        precisa_cuidado: morador.precisa_cuidado });
    } catch (error) { return response.status(500).json({ erro: "Erro BD : buscarMoradorAdiional" }); }
  }; 

  static async cadastrarImóvelAluguel(request, response) {
  try {
    const { id, nível_interesse, tenho_pet, mobília_inclusa, valor_negociação, justificativa, interessado_desde, cpf } = request.body;
    const cpf_encriptado = md5(cpf);
    
    console.log(`buscando dados para o contrato com id: ${id}`);
    
    const morador_adicional = await MoradorAdicional.findOne({ where: { usuário: cpf_encriptado } });
    const contrato = await ContratoLocação.findOne(id);

    if (!morador_adicional || !contrato) {
      return response.status(404).json({ erro: "Morador ou Contrato não encontrado." });
    }


    console.log(`Verificando duplicidade com Morador ID: ${morador_adicional.id} e Contrato ID: ${contrato.id}`);
    const interesses = await ImóvelAluguel.find({ where: { contrato, morador_adicional }});
    console.log(`Consulta encontrou ${interesses.length} interesses existentes`);

    if (interesses.length > 0) {
      console.log("mais de um cadastro de interesse");
      return response.status(409).json({ erro: "O aluno já cadastrou interesse para a proposta." });
    }
    
    await ImóvelAluguel.create({ nível_interesse, tenho_pet, mobília_inclusa, valor_negociação, justificativa, interessado_desde, morador_adicional, contrato }).save();
    
    return response.json({ sucesso: true });

  } catch (error) {
    return response.status(500).json({ erro: "Erro BD : cadastrarImóvelAluguel", detalhe: error.message });
  }
};
  static async removerImóvelAluguel(request, response) {
    try {
    const id = request.params.id;
      await ImóvelAluguel.delete(id);
      return response.json();
    } catch (error) { return response.status(500).json({ erro: "Erro BD : removerImóvelAluguel" }); }
  };
  static async buscarImóveisAluguelMoradorAdicional(request, response) {
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const interesses = await ImóvelAluguel.find({ where: { morador_adicional: { usuário: cpf_encriptado } },
        relations: ["morador_adicional", "morador_adicional.usuário", "contrato", "contrato.inquilino", 
          "contrato.inquilino.usuário" ] });
      return response.json(interesses);
    } catch (error) { return response.status(500).json
       ({ erro: "Erro BD : buscarImóveisAluguelMorador" }); }
  };
  static async buscarContratosLocação(request, response) {
  try {
    const propostas = await ContratoLocação.find({ relations: ["inquilino", "inquilino.usuário"] });
    return response.json(propostas);
  } catch (error) { return response.status(500).json({ erro: "Erro BD : buscarPropostas" }); }
 };
}