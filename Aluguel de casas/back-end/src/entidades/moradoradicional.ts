 import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn }
 from "typeorm";
 import Usuário from "./usuário";
 import ImóvelAluguel from "./imóvelaluguel";
 export enum Rotina { DIA = "Diurna", NOITE = "Noturna" };
 @Entity()
 export default class MoradorAdicional extends BaseEntity {
 @PrimaryGeneratedColumn()
 id: number;
 @Column({ type: "enum", enum: Rotina })
 rotina: Rotina;
 @Column()
 ano_ingresso: number;
 @Column({ type: "date" })
 data_nascimento: Date;
 @Column()
 telefone: string;
 @Column()
 precisa_cuidado: boolean;
 @Column()
DescriçâoPessoal: string;

 @OneToMany(() => ImóvelAluguel, (imovel) => imovel.morador)
 imovel: ImóvelAluguel[];
 @OneToOne(() => Usuário, usuário => usuário.morador_adicional, { onDelete: "CASCADE" })
 @JoinColumn()
 usuário: Usuário;
 }