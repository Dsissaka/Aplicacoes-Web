import md5 from "md5";
import { getManager } from "typeorm";
import Usuário, { Status } from "../entidades/usuário";
import Inquilino from "../entidades/inquilino";
import ServiçosUsuário from "./serviços-usuário";
import ContratoLocação from "../entidades/contrato-locação";
import ImóvelAluguel from "src/entidades/imóvel-aluguel";

export default class ServiçosInquilino {
  constructor() {}

  static async cadastrarInquilino(request, response) {
    try {
      const { usuário_info, tipo, tempo_alugando, fumante, profissão, descrição_pessoal } = request.body;

      // cria usuário primeiro
      const { usuário, token } = await ServiçosUsuário.cadastrarUsuário(usuário_info);
      const entityManager = getManager();

      await entityManager.transaction(async (transactionManager) => {
        await transactionManager.save(usuário);

        // cria inquilino já com os novos campos
        const inquilino = Inquilino.create({
          usuário,
          tipo,
          tempo_alugando,
          fumante,
          profissão,
          descrição_pessoal,
        });

        await transactionManager.save(inquilino);

        await transactionManager.update(Usuário, usuário.cpf, { status: Status.ATIVO });

        return response.json({ status: Status.ATIVO, token });
      });
    } catch (error) {
      return response.status(500).json({ erro: error });
    }
  }
  static async atualizarInquilino(request, response) {
    try {
      const { cpf, tipo, tempo_alugando, fumante, profissão, descrição_pessoal } = request.body;
      const cpf_encriptado = md5(cpf);
      await Inquilino.update({ usuário: { cpf: cpf_encriptado } },
        { tipo, tempo_alugando, fumante, profissão, descrição_pessoal});
      return response.json();
    } catch (error) { return response.status(500).json({ erro: "Erro BD : atualizarInquilino" }); }
  };

  static async cadastrarContratoLocação (request, response) {
    console.log("Chegou no backend com body:");
    try {
      const {título, status, bairro, data_fim, descrição_casa, dia_pagamento, valor_mensal, finalizada, endereço, cpf} = request.body;
      const cpf_encriptado = md5(cpf);
      const inquilino = await Inquilino.findOne({ where: { usuário: {cpf: cpf_encriptado} },relations: ["usuário" ] });
      console.log("Inquilino encontrado:");
      await ContratoLocação.create({título, status, bairro, data_fim, descrição_casa, valor_mensal,  dia_pagamento, finalizada, endereço, inquilino}).save();
      console.log("Criado com sucesso a proposta:");
      return response.json();
    } catch (error) { return response.status(500).json({ erro: "Erro BD : cadastrarProposta" }); }
  };
  static async alterarContratoLocação(request, response) {
    try {
      const {id, título, status, bairro, data_fim, descrição_casa, finalizada, dia_pagamento, valor_mensal, endereço} = request.body;
      await ContratoLocação.update(id, {título, status, bairro, data_fim, descrição_casa, valor_mensal,finalizada, dia_pagamento, endereço});
      return response.json();
    } catch (error) { return response.status(500).json({ erro: "Erro BD : alterarProposta" }); }
  };
  static async removerContratoLocação(request, response) {
    try {
      const id_proposta = request.params.id;
      const proposta = await ContratoLocação.findOne(id_proposta);
      await ContratoLocação.remove(proposta);
      return response.json();
    } catch (error) { return response.status(500).json({ erro: "Erro BD : removerProposta" }); }
  };
  static async buscarContratosLocaçãoInquilino(request, response) {
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const propostas = await ContratoLocação.find({ where: { inquilino: { usuário: cpf_encriptado } }, relations: ["inquilino", "inquilino.usuário"] });
      return response.json(propostas);
    } catch (error) { return response.status(500).json({ erro: "Erro BD : buscarPropostasInquilino" }); }
  };
  static filtrarBairroEliminandoRepetição(propostas: ContratoLocação[]) {
    let bairro: { label: string, value: string }[];
    bairro = propostas.filter((proposta, índice, propostas_antes_filtrar) =>
      propostas_antes_filtrar.findIndex
        (proposta_anterior => proposta_anterior.bairro === proposta.bairro) === índice)
        .map(proposta => ({ label: proposta.bairro, value: proposta.bairro }));
    return bairro;
  };
  static async buscarBairroContratosLocação(request, response) {
    try {
      const propostas = await ContratoLocação.find();
      const bairro = ServiçosInquilino.filtrarBairroEliminandoRepetição(propostas);
      return response.json(bairro.sort());
    } catch (error) { return response.status(500).json({ erro: "Erro BD : buscarÁreasAtuaçãoPropostas" }); }
  };

  static async buscarImóveisAluguelContratoLocação(request, response) {
  try {
    const id_proposta = request.params.id_proposta;

    console.log("id_proposta:", id_proposta);

    const interesses = await ImóvelAluguel.find({
      where: { contrato: { id: id_proposta } },
      relations: ["morador_adicional", "morador_adicional.usuário", "contrato"]
    });

    return response.json(interesses);
  } catch (error) {
    console.error("❌ Erro BD : buscarImóveisAluguelContratoLocação", error);
    return response.status(500).json({
      erro: "Erro BD : buscarImóveisAluguelContratoLocação"
    });
  }
}

  static async buscarInquilino(request, response) {
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const inquilino = await Inquilino.findOne({
        where: { usuário: cpf_encriptado },
        relations: ["usuário"],
      });

      if (!inquilino) return response.status(404).json({ erro: "Inquilino não encontrado." });

      return response.json({
        nome: inquilino.usuário.nome,
        email: inquilino.usuário.email,
        tipo: inquilino.tipo,
        tempo_alugando: inquilino.tempo_alugando,
        fumante: inquilino.fumante,
        profissão: inquilino.profissão,
        regras_casa_pessoal: inquilino.descrição_pessoal,
      });
    } catch (error) {
      return response.status(500).json({ erro: "Erro BD : buscarInquilino" });
    }
  }
}
