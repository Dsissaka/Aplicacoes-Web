import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
 import Inquilino from "./inquilino";
 import ImovelAluguel from "./imóvel-aluguel";
 export enum CategoriaMoradia { CASA = "Casa", APARTAMENTO = "Apartamento", KITNET = "Kitnet" };
 @Entity()
 export default class ContratoLocação extends BaseEntity {
 @PrimaryGeneratedColumn()
 id: number;
 @Column()
 valor_mensal: number;
 @Column({ type: "enum", enum: CategoriaMoradia })
 status: CategoriaMoradia;
 @Column({ type: "date" })
 data_fim: Date
 @Column()
 dia_pagamento: string;
 @Column()
 descrição_casa: string;
 @Column()
 finalizada: boolean;  
 @Column()
 título: string;
 @Column()
 bairro: string;
  @Column()
 endereço: string;


 @ManyToOne(() => Inquilino, (inquilino) => inquilino.contratos, { onDelete: "CASCADE" })
 inquilino: Inquilino;
 @OneToMany(() => ImovelAluguel, (imovel) => imovel.contrato)
 imoveis: ImovelAluguel[];
 }