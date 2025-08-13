import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from
"typeorm";
import Usuário from "./usuário";
import Proposta from "./proposta";
export enum Titulação {MESTRADO = "mestrado", DOUTORADO = "doutorado"};
@Entity()
export default class Professor extends BaseEntity {
@PrimaryGeneratedColumn()
id: number;
@Column({ type: "enum", enum: Titulação })
titulação: Titulação;
@Column()
anos_experiência_empresarial: number;
@OneToMany(() => Proposta, (proposta) => proposta.professor)
propostas: Proposta[];
@OneToOne(() => Usuário, (usuário) => usuário.professor, { onDelete: "CASCADE" })
@JoinColumn()
usuário: Usuário;
}