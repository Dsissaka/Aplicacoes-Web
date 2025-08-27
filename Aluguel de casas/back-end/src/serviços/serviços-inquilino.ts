import md5 from "md5";
import { getManager } from "typeorm";
import Usuário, { Status } from "../entidades/usuário";
import Inquilino from "../entidades/inquilino";
import ServiçosUsuário from "./serviços-usuário";

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
        descrição_pessoal: inquilino.descrição_pessoal,
      });
    } catch (error) {
      return response.status(500).json({ erro: "Erro BD : buscarInquilino" });
    }
  }
}
