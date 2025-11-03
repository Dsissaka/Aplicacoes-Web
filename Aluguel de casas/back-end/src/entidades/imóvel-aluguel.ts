 import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 
"typeorm";
 import MoradorAdicional from "./morador-adicional";
 import ContratoLocação from "./contrato-locação";
 export enum Interesse { ALTO = "Alto", MÉDIO = "Médio", BAIXO = "Baixo", URGENTE = "Urgente" };
 @Entity()
 export default class ImóvelAluguel extends BaseEntity {
 @PrimaryGeneratedColumn()
 id: number;
 @Column({type: "enum", enum: Interesse })
 nível_interesse: Interesse;
 @Column()
 tenho_pet: boolean;
 @Column()
 mobília_inclusa: boolean;
 @Column()
 valor_negociação: number;
 @Column()
 justificativa: string;
 @CreateDateColumn()
 interessado_desde: Date;

 
 @ManyToOne(() => ContratoLocação, (contrato) => contrato.imoveis, { onDelete: "CASCADE" })
 contrato: ContratoLocação;
 @ManyToOne(() => MoradorAdicional, (morador_adicional) => morador_adicional.imoveis, { onDelete: "CASCADE" })
 morador_adicional: MoradorAdicional;
 }