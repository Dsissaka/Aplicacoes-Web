 import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 
"typeorm";
 import MoradorAdicional from "./moradoradicional";
 import ContratoLocação from "./contratolocação";
 export enum Categoria { CASA = "Casa", APARTAMENTO = "Apartamento" };
 @Entity()
 export default class ImóvelAlugel extends BaseEntity {
 @PrimaryGeneratedColumn()
 id: number;
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
 disponível_desde: Date;
 @ManyToOne(() => ContratoLocação, (contrato) => contrato.imovel, { onDelete: "CASCADE" })
 contrato: ContratoLocação;
 @ManyToOne(() => MoradorAdicional, (morador) => morador.imovel, { onDelete: "CASCADE" })
 morador: MoradorAdicional;
 }