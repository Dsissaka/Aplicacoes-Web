 import { BaseEntity, Column, CreateDateColumn, Entity, OneToOne, PrimaryColumn } from "typeorm";
 import Inquilino from "./inquilino";
 import MoradorAdicional from "./moradoradicional";
 export enum Perfil { MORADORDICIONAÇ = "aluno", INQUILINO = "professor" };
 export enum Status { PENDENTE = "pendente", ATIVO = "ativo" };
 export enum Cores { AMARELO = "yellow", ANIL = "indigo", AZUL = "blue", AZUL_PISCINA = "cyan", 
  CINZA_ESCURO = "bluegray",  LARANJA = "orange", ROSA = "pink", ROXO = "purple", VERDE = "green", 
  VERDE_AZULADO = "teal" };
 @Entity()
 export default class Usuário extends BaseEntity {
  @PrimaryColumn()
  cpf: string;
  @Column({type: "enum", enum: Perfil })
  perfil: Perfil;
  @Column({type: "enum", enum: Status, default: Status.PENDENTE })
  status: Status;
  @Column()
  nome: string;
  @Column()
  email: string;
  @Column()
  senha: string;
  @Column()
  questão: string;
  @Column()
  resposta: string;
  @Column({ type: "enum", enum: Cores })
  cor_tema: string;
  @OneToOne(() => Inquilino, (inquilino) => inquilino.usuário)
  inquilino: Inquilino;
  @OneToOne(() => MoradorAdicional, (morador_adicional) => morador_adicional.usuário)
  morador_adicional: MoradorAdicional;
  @CreateDateColumn()
  data_criação: Date;
 }