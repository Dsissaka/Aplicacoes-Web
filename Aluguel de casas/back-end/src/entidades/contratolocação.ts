import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
 import Inquilino from "./inquilino";
 import ImovelAluguel from "./imóvelaluguel";
 export enum StatusInteresse { INTERESSADO = "Interessado", DESINTERESSADO = "Desinteressado", PENDENTE = "Pendente" };
 @Entity()
 export default class ContratoLocação extends BaseEntity {
 @PrimaryGeneratedColumn()
 id: number;
 @Column()
 valor_mensal: number;
 @Column({ type: "enum", enum: StatusInteresse })
 status: StatusInteresse;
 @Column({ type: "date" })
 data_fim: Date
 @Column({ type: "date" })
 dia_pagamento: Date;
 @Column()
 regras_casa: string;  
 @ManyToOne(() => Inquilino, (inquilino) => inquilino.contratos, { onDelete: "CASCADE" })
 inquilino: Inquilino;
 @OneToMany(() => ImovelAluguel, (imovel) => imovel.contrato)
 imoveis: ImovelAluguel[];
 }