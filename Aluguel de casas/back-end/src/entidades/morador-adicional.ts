 import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn }
 from "typeorm";
 import Usuário from "./usuário";
 import ImóvelAluguel from "./imóvel-aluguel";
 export enum Rotina { DIA = "Diurna", NOITE = "Noturna" };
 @Entity()
 export default class MoradorAdicional extends BaseEntity {
 @PrimaryGeneratedColumn()
 id: number;
 @Column()
 precisa_cuidado: boolean;
 @Column({ type: "enum", enum: Rotina })
 rotina: Rotina;
 @Column()
 ano_ingresso: number;


 @OneToMany(() => ImóvelAluguel, (imovel) => imovel.morador_adicional)
 imoveis: ImóvelAluguel[];
 @OneToOne(() => Usuário, usuário => usuário.morador_adicional, { onDelete: "CASCADE" })
 @JoinColumn()
 usuário: Usuário;
 }