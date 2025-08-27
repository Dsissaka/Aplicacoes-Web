 import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 
"typeorm";
 import MoradorAdicional from "./morador-adicional";
 import ContratoLocação from "./contrato-locação";
 export enum Categoria { CASA = "Casa", APARTAMENTO = "Apartamento" };
 @Entity()
 export default class ImóvelAluguel extends BaseEntity {
 @PrimaryGeneratedColumn()
 id: number;
 @Column({type: "enum", enum: Categoria })
 categoria: Categoria;
 @Column()
 aceita_pet: boolean;
 @Column()
 mobília_inclusa: boolean;
 @Column()
 valor: number;
 @Column()
 endereço: string;
 @Column()
 descrição_imóvel: string;
 @Column()
 número_quartos: number;
 @CreateDateColumn()
 disponível_desde: number;

 
 @ManyToOne(() => ContratoLocação, (contrato) => contrato.imoveis, { onDelete: "CASCADE" })
 contrato: ContratoLocação;
 @ManyToOne(() => MoradorAdicional, (morador_adicional) => morador_adicional.imoveis, { onDelete: "CASCADE" })
 morador_adicional: MoradorAdicional;
 }